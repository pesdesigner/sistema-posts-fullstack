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
                // Se o autor existir, pega o nome. Se não, exibe "Anônimo"
                post.getAutor() != null ? post.getAutor().getNome() : "Anônimo",
                // Se o autor existir, pega o ID. Se não, retorna 0
                post.getAutor() != null ? post.getAutor().getId() : 0L
        );
    }
}

