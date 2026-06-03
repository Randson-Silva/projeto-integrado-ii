package com.associados.associados.associate.dtos.request;

import com.associados.associados.associate.enums.EscolaridadeEnum;
import com.associados.associados.associate.enums.RendaEnum;

public record UpdateSelfDeclarationDto(
        String socialName,
        String race,
        String gender,
        String sexualOrientation,
        EscolaridadeEnum education,
        RendaEnum income
) {}
