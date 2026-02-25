package com.cadastro.demonstrativo.dto;

import com.cadastro.demonstrativo.entity.enums.Perfil;

public record DadosTokenDTO(
        String token,
        Long id,
        String nome,
        Perfil perfil
) {}
