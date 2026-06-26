package com.associados.associados.card.service;

import java.time.LocalDate;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.associados.associados.associate.entity.Associate;
import com.associados.associados.associate.entity.SelfDeclaration;
import com.associados.associados.associate.repository.AssociateRepository;
import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.card.dtos.response.CardResponseDto;
import com.associados.associados.card.dtos.response.CardValidationResponseDto;
import com.associados.associados.card.entity.Card;
import com.associados.associados.card.repository.CardRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final AssociateRepository associateRepository;

    @Transactional
    public Card createForAssociate(Associate associate) {
        if (associate == null || associate.getId() == null) {
            throw new BusinessException("Associate is required to generate a card");
        }

        if (cardRepository.existsByAssociateId(associate.getId())) {
            return cardRepository.findByAssociateId(associate.getId())
                    .orElseThrow(() -> new BusinessException("Card already exists for this associate"));
        }

        Card card = new Card();
        card.setAssociate(associate);
        card.setUser(associate.getUser());
        card.setFullName(associate.getUser().getName());
        card.setSocialName(resolveSocialName(associate));
        card.setCpf(associate.getCpf());
        card.setCategory(associate.getWorkCategory());
        card.setValidity(LocalDate.now().plusYears(1)); // Regra temporária; alterar para regra de negocio de alterar a data de validade quando quiser
        card.setNumber(generateCardNumber());

        return cardRepository.save(card);
    }

    public CardResponseDto getOwnCard(java.util.UUID userId) {
        Associate associate = associateRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException("Associate not found"));

        Card card = cardRepository.findByAssociateId(associate.getId())
                .orElseThrow(() -> new BusinessException("Card not found"));

        return new CardResponseDto(card);
    }

    @Transactional
    public void deleteByAssociateId(java.util.UUID associateId) {
        if (associateId == null) {
            return;
        }
        cardRepository.deleteByAssociateId(associateId);
    }

    public CardValidationResponseDto validateCard(String number) {
        Card card = cardRepository.findByNumber(number).orElse(null);

        if (card == null) {
            return new CardValidationResponseDto(
                    false,
                    null,
                    null,
                    null,
                    null,
                    number,
                    null,
                    "Card not found");
        }

        boolean valid = !card.getValidity().isBefore(LocalDate.now());
        String message = valid ? "Card is valid" : "Card expired";
        return new CardValidationResponseDto(
                valid,
                card.getUser() == null ? null : card.getUser().getAvatarUrl(),
                card.getFullName(),
                card.getSocialName(),
                card.getCategory() == null ? null : new com.associados.associados.associate.dtos.response.CategoryResponseDto(card.getCategory()),
                card.getNumber(),
                card.getValidity(),
                message);
    }

    private String generateCardNumber() {
        String yearPrefix = String.format(Locale.ROOT, "%02d", LocalDate.now().getYear() % 100);
        long sequence = cardRepository.countByNumberStartingWith(yearPrefix) + 1;
        if (sequence > 999) {
            throw new BusinessException("Card number limit reached for the current year");
        }
        return yearPrefix + String.format(Locale.ROOT, "%03d", sequence);
    }

    private String resolveSocialName(Associate associate) {
        SelfDeclaration declaration = associate.getSelfDeclaration();
        if (declaration != null && declaration.getSocialName() != null && !declaration.getSocialName().isBlank()) {
            return declaration.getSocialName();
        }
        return associate.getUser().getName();
    }
}
