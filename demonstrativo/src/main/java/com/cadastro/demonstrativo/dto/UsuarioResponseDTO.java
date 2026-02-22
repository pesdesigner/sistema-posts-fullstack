package com.cadastro.demonstrativo.dto;

import com.cadastro.demonstrativo.entity.Usuario;

public record UsuarioResponseDTO(Long id, String nome, String email) {
    // Construtor de conveniencia para converter a Entity para DTO
    public UsuarioResponseDTO(Usuario usuario) {
        this(usuario.getId(), usuario.getNome(), usuario.getEmail());
    }
}

