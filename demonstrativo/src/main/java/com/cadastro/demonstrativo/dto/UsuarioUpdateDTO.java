package com.cadastro.demonstrativo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
public record UsuarioUpdateDTO(
        @NotBlank String nome,
        @NotBlank @Email String email,
        String senha // Remova o @NotBlank aqui para ser opcional
) {}

