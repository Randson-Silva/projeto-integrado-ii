package com.associados.associados.card.service;

import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Service;

import com.associados.associados.card.entity.Card;

@Service
public class CardPdfService {

    // mock (substituir depois pelo metodo de gerar pdf real)
    public byte[] generate(Card card) {
        String content = String.format(
                "CARTEIRINHA [MOCK]%n%n" +
                "Nome: %s%n" +
                "Nome Social: %s%n" +
                "CPF: %s%n" +
                "Categoria: %s%n" +
                "Numero: %s%n" +
                "Validade: %s" + 
                "Url da Foto: %s",
                card.getFullName(),
                card.getSocialName(),
                card.getCpf(),
                card.getCategory() != null ? card.getCategory().getName() : "-",
                card.getNumber(),
                card.getValidity(),
                card.getUser().getAvatarUrl());
        return content.getBytes(StandardCharsets.UTF_8);
    }
}
