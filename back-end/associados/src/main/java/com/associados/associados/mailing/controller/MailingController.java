package com.associados.associados.mailing.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.mailing.dtos.request.SendMailingDto;
import com.associados.associados.mailing.dtos.response.MailingRecipientResponseDto;
import com.associados.associados.mailing.dtos.response.MailingSentResponseDto;
import com.associados.associados.mailing.enums.MailingRecipientScope;
import com.associados.associados.mailing.service.MailingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/mailing")
@RequiredArgsConstructor
@Tag(name = "Mailing", description = "Endpoints for sending bulk emails to associates")
public class MailingController {

    private final MailingService mailingService;

    @GetMapping("/recipients")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List mailing recipients", description = "Retrieves names and emails by recipient scope: ALL, ASSOCIATES, or ADMINS_AND_CONSULTANTS.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Recipients retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<List<MailingRecipientResponseDto>> getRecipients(
            @RequestParam(defaultValue = "ALL") MailingRecipientScope scope) {
        return ResponseEntity.ok(mailingService.getRecipients(scope));
    }

    @PostMapping("/send")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Send mailing", description = "Sends the same subject and message to the selected emails.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Mailing sent successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<MailingSentResponseDto> sendMailing(@RequestBody @Valid SendMailingDto data) {
        int sentCount = mailingService.sendMailing(data);
        return ResponseEntity.ok(new MailingSentResponseDto("Mailing sent successfully!", sentCount));
    }
}
