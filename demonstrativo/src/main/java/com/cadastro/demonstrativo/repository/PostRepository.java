package com.cadastro.demonstrativo.repository;

import com.cadastro.demonstrativo.entity.Post;
import com.cadastro.demonstrativo.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Busca posts filtrados por tecnologia (ex: encontrar todos de "Java")
    List<Post> findByTecnologiaIgnoreCase(String tecnologia);
    List<Post> findByAutorId(Long autorId);

    boolean existsByTituloAndTecnologiaAndAutor(String titulo, String tecnologia, Usuario autor);

}

