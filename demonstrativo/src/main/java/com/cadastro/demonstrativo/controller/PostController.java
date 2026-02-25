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
        // Busca o autor
        var autor = usuarioRepository.findById(dados.usuarioId())
                .orElseThrow(() -> new RuntimeException("Autor não encontrado"));

        // REGRA DE DUPLICIDADE:
        // Verifica se já existe um post com mesmo título E tecnologia PARA ESTE AUTOR
        boolean jaExiste = postRepository.existsByTituloAndTecnologiaAndAutor(
                dados.titulo(), dados.tecnologia(), autor
        );

        if (jaExiste) {
            // O GlobalExceptionHandler vai capturar isso e mandar pro React
            throw new RuntimeException("Você já cadastrou um snippet com este título para " + dados.tecnologia());
        }

        Post novoPost = new Post();
        novoPost.setTitulo(dados.titulo());
        novoPost.setDescricao(dados.descricao());
        novoPost.setComando(dados.comando());
        novoPost.setTecnologia(dados.tecnologia());
        novoPost.setAutor(autor);

        postRepository.save(novoPost);
        return ResponseEntity.status(HttpStatus.CREATED).body(new PostResponseDTO(novoPost));
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

    @GetMapping("/autor/{id}")
    public List<PostResponseDTO> listarPorAutor(@PathVariable Long id) {
        return postRepository.findByAutorId(id)
                .stream()
                .map(PostResponseDTO::new)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDTO> buscarPorId(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(post -> ResponseEntity.ok(new PostResponseDTO(post)))
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/{postId}/{usuarioId}")
    public ResponseEntity<?> atualizarPost(@PathVariable Long postId, @PathVariable Long usuarioId, @RequestBody PostRequestDTO dados) {
        return postRepository.findById(postId).map(post -> {
            // Validação de Propriedade
            if (!post.getAutor().getId().equals(usuarioId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para editar este post.");
            }

            post.setTitulo(dados.titulo());
            post.setDescricao(dados.descricao());
            post.setComando(dados.comando());
            post.setTecnologia(dados.tecnologia());

            postRepository.save(post);
            return ResponseEntity.ok(new PostResponseDTO(post));
        }).orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{postId}/{usuarioId}")
    public ResponseEntity<?> excluirPost(@PathVariable Long postId, @PathVariable Long usuarioId) {
        return postRepository.findById(postId).map(post -> {
            // Validação crucial: o usuário que apaga é o autor?
            if (!post.getAutor().getId().equals(usuarioId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Erro: Você não tem permissão para excluir este post.");
            }
            postRepository.delete(post);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

}

