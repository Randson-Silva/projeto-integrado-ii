package com.associados.associados.card.dtos.response;

import java.time.LocalDate;

public record CardValidationResponseDto(
        boolean valid,
        String number,
        LocalDate validity,
        String message) {
}
