package com.associados.associados.card.controller;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.card.dtos.response.CardResponseDto;
import com.associados.associados.card.dtos.response.CardValidationResponseDto;
import com.associados.associados.card.service.CardService;
import com.associados.associados.config.SystemConfigurationService;
import com.associados.associados.user.entity.User;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cards")
@RequiredArgsConstructor
@Tag(name="Cards", description="Endpoints for Cards Management")
public class CardController {

    private final CardService cardService;
    private final SystemConfigurationService configurationService;

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Retrieve authenticated associate's card", description = "Retrieves the basic details of the associate's card based on the authenticated user context.")
    public ResponseEntity<CardResponseDto> getOwnCard(@AuthenticationPrincipal User user) {
        if (user == null) {
            throw new BusinessException("Unauthenticated user.");
        }
        return ResponseEntity.ok(cardService.getOwnCard(user.getId()));
    }

    @GetMapping("/validate")
    @Operation(summary = "Validate card", description = "Validates a card existence and status using the card number.")
    public ResponseEntity<CardValidationResponseDto> validateCard(@RequestParam String number) {
        return ResponseEntity.ok(cardService.validateCard(number));
    }

    @GetMapping("/settings/validity")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get default card validity date", description = "Retrieves the global expiration date required to generate any new associate cards.")
    public ResponseEntity<LocalDate> getDefaultValidity() {
        LocalDate currentValidity = configurationService.getCardValidityConfiguration()
                .orElseThrow(() -> new BusinessException("A default validity date has not been set by an administrator."));
        
        return ResponseEntity.ok(currentValidity);
    }

    @PutMapping("/settings/validity")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update default card validity date (Admin only)", description = "Sets the global expiration date required to generate any new associate cards.")
    public ResponseEntity<Void> updateDefaultValidity(@RequestParam java.time.LocalDate validityDate) {
        
        if (validityDate != null && validityDate.isBefore(LocalDate.now())) {
            throw new BusinessException("The default validity date cannot be in the past.");
        }

        configurationService.updateCardValidityConfiguration(validityDate);
        return ResponseEntity.noContent().build();
    }
}