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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @PostMapping("/bulk")
    public ResponseEntity<?> criarPostsEmMassa(@RequestBody @Valid List<PostRequestDTO> listaDados) {
        List<PostResponseDTO> salvos = new ArrayList<>();
        List<String> erros = new ArrayList<>();

        for (PostRequestDTO dados : listaDados) {
            try {
                // Reutiliza a lógica de busca do autor que já temos
                var autor = usuarioRepository.findById(dados.usuarioId())
                        .orElseThrow(() -> new RuntimeException("Autor " + dados.usuarioId() + " não encontrado"));

                // Verifica duplicidade antes de salvar cada um
                boolean jaExiste = postRepository.existsByTituloAndTecnologiaAndAutor(
                        dados.titulo(), dados.tecnologia(), autor
                );

                if (!jaExiste) {
                    Post post = new Post();
                    post.setTitulo(dados.titulo());
                    post.setDescricao(dados.descricao());
                    post.setComando(dados.comando());
                    post.setTecnologia(dados.tecnologia());
                    post.setAutor(autor);

                    postRepository.save(post);
                    salvos.add(new PostResponseDTO(post));
                } else {
                    erros.add("Duplicado: " + dados.titulo());
                }
            } catch (Exception e) {
                erros.add("Erro no post '" + dados.titulo() + "': " + e.getMessage());
            }
        }

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("sucessos", salvos.size());
        resposta.put("falhas", erros);

        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    // 1. Listar ABSOLUTAMENTE TODOS os posts (com info do autor)
    @GetMapping("/admin/todos")
    @PreAuthorize("hasRole('ADMIN')")
    public List<PostResponseDTO> listarTudoAdmin() {
        return postRepository.findAll()
                .stream()
                .map(PostResponseDTO::new)
                .toList();
    }

    // 2. Exclusão Universal (O Admin apaga qualquer post pelo ID)
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> excluirQualquerPost(@PathVariable Long id) {
        return postRepository.findById(id).map(post -> {
            postRepository.delete(post);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/estatisticas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> obterEstatisticas() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPosts", postRepository.count());
        stats.put("totalUsuarios", usuarioRepository.count());

        // Contagem por tecnologia (Ex: {Java: 5, Docker: 3})
        var posts = postRepository.findAll();
        Map<String, Long> porTech = posts.stream()
                .collect(Collectors.groupingBy(Post::getTecnologia, Collectors.counting()));

        stats.put("porTecnologia", porTech);
        return ResponseEntity.ok(stats);
    }


}

