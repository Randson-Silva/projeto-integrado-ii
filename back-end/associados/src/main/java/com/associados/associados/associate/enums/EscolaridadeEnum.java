package com.associados.associados.associate.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EscolaridadeEnum {

    FUNDAMENTAL_INCOMPLETO("Ensino Fundamental Incompleto"),
    FUNDAMENTAL_COMPLETO("Ensino Fundamental Completo"),

    MEDIO_INCOMPLETO("Ensino Médio Incompleto"),
    MEDIO_COMPLETO("Ensino Médio Completo"),

    SUPERIOR_INCOMPLETO("Ensino Superior Incompleto"),
    SUPERIOR_COMPLETO("Ensino Superior Completo"),

    ESPECIALIZACAO_INCOMPLETA("Especialização Incompleta"),
    ESPECIALIZACAO_COMPLETA("Especialização Completa"),

    MESTRADO_INCOMPLETO("Mestrado Incompleto"),
    MESTRADO_COMPLETO("Mestrado Completo"),

    DOUTORADO_INCOMPLETO("Doutorado Incompleto"),
    DOUTORADO_COMPLETO("Doutorado Completo");

    private final String description;
}