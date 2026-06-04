package com.associados.associados.associate.dtos.response;

import com.associados.associados.associate.entity.SelfDeclaration;
import com.associados.associados.associate.enums.EscolaridadeEnum;
import com.associados.associados.associate.enums.RendaEnum;

public record SelfDeclarationResponseDto(
        String socialName,
        String race,
        String gender,
        String sexualOrientation,
        EscolaridadeEnum education,
        RendaEnum income
) {
    public SelfDeclarationResponseDto(SelfDeclaration selfDeclaration) {
        this(
                selfDeclaration.getSocialName(),
                selfDeclaration.getRace(),
                selfDeclaration.getGender(),
                selfDeclaration.getSexualOrientation(),
                selfDeclaration.getEducation(),
                selfDeclaration.getIncome()
        );
    }
}
