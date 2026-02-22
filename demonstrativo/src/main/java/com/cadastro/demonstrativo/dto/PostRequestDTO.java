package com.cadastro.demonstrativo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PostRequestDTO(
        @NotBlank(message = "O título é obrigatório")
        String titulo,

        @NotBlank(message = "A descrição é obrigatória")
        String descricao,

        @NotBlank(message = "O comando de exemplo é obrigatório")
        String comando,

        @NotBlank(message = "A tecnologia deve ser informada (Ex: Java, C#, Python)")
        String tecnologia,

        @NotNull(message = "O ID do autor é obrigatório")
        Long usuarioId
) {}

