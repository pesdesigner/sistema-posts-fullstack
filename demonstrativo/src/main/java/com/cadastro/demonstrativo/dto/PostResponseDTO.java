package com.cadastro.demonstrativo.dto;

import com.cadastro.demonstrativo.entity.Post;

public record PostResponseDTO(
        Long id,
        String titulo,
        String descricao,
        String comando,
        String tecnologia,
        String nomeAutor, // Apenas o nome do autor para o Feed
        Long usuarioId
) {
    // Construtor para converter a Entity Post em DTO
    public PostResponseDTO(Post post) {
        this(
                post.getId(),
                post.getTitulo(),
                post.getDescricao(),
                post.getComando(),
                post.getTecnologia(),
                post.getAutor().getNome(),
                post.getAutor().getId()
        );
    }
}

