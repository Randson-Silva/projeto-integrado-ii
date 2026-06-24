package com.associados.associados.card.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.card.dtos.response.CardResponseDto;
import com.associados.associados.card.service.CardService;
import com.associados.associados.user.entity.User;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<CardResponseDto> getOwnCard(@AuthenticationPrincipal User user) {
        if (user == null) {
            throw new BusinessException("Unauthenticated user.");
        }
        return ResponseEntity.ok(cardService.getOwnCard(user.getId()));
    }
}
