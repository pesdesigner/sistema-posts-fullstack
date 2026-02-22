package com.cadastro.demonstrativo.dto;
public record PostResponseDTO(
        Long id,
        String titulo,
        String descricao,
        String comando,
        String tecnologia,
        String nomeAutor // Apenas o nome do autor para o Feed
) {
    // Construtor para converter a Entity Post em DTO
    public PostResponseDTO(com.cadastro.demonstrativo.entity.Post post) {
        this(
                post.getId(),
                post.getTitulo(),
                post.getDescricao(),
                post.getComando(),
                post.getTecnologia(),
                post.getAutor().getNome()
        );
    }
}

