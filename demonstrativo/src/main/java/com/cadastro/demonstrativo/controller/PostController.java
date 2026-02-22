package com.cadastro.demonstrativo.controller;

import com.cadastro.demonstrativo.dto.PostRequestDTO;
import com.cadastro.demonstrativo.dto.PostResponseDTO;
import com.cadastro.demonstrativo.entity.Post;
import com.cadastro.demonstrativo.repository.PostRepository;
import com.cadastro.demonstrativo.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<?> criarPost(@RequestBody @Valid PostRequestDTO dados) {
        // Buscamos o autor primeiro
        var autorOptional = usuarioRepository.findById(dados.usuarioId());

        if (autorOptional.isEmpty()) {
            // Se não encontrar, retorna String (Permitido pelo <?>)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Erro: Autor com ID " + dados.usuarioId() + " não encontrado.");
        }

        // Se encontrar, seguimos com a lógica
        var autor = autorOptional.get();

        Post novoPost = new Post();
        novoPost.setTitulo(dados.titulo());
        novoPost.setDescricao(dados.descricao());
        novoPost.setComando(dados.comando());
        novoPost.setTecnologia(dados.tecnologia());
        novoPost.setAutor(autor);

        Post postSalvo = postRepository.save(novoPost);

        // Retorna o DTO (Permitido pelo <?>)
        return ResponseEntity.status(HttpStatus.CREATED).body(new PostResponseDTO(postSalvo));
    }


    @GetMapping
    public List<PostResponseDTO> listarTodos() {
        return postRepository.findAll()
                .stream()
                .map(PostResponseDTO::new)
                .toList();
    }

    @GetMapping("/tecnologia/{tech}")
    public List<PostResponseDTO> listarPorTecnologia(@PathVariable String tech) {
        return postRepository.findByTecnologiaIgnoreCase(tech)
                .stream()
                .map(PostResponseDTO::new)
                .toList();
    }
}

