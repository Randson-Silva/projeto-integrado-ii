package com.associados.associados.card.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.card.dtos.response.CardResponseDto;
import com.associados.associados.card.dtos.response.CardValidationResponseDto;
import com.associados.associados.card.service.CardService;
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
}
