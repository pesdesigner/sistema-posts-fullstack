package com.cadastro.demonstrativo.dto;

import com.cadastro.demonstrativo.entity.enums.Perfil;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioUpdateDTO(
        @NotBlank String nome,
        @NotBlank @Email String email,
        String senha, // Remova o @NotBlank aqui para ser opcional
        @NotNull Perfil perfil
) {}

