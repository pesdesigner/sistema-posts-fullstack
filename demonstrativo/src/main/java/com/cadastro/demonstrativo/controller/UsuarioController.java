package com.cadastro.demonstrativo.controller;

import com.cadastro.demonstrativo.dto.UsuarioRequestDTO;
import com.cadastro.demonstrativo.dto.UsuarioResponseDTO;
import com.cadastro.demonstrativo.dto.UsuarioUpdateDTO;
import com.cadastro.demonstrativo.entity.Usuario;
import com.cadastro.demonstrativo.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioRepository repository;

    @GetMapping
    public List<UsuarioResponseDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(UsuarioResponseDTO::new)
                .toList();
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> salvar(@RequestBody @Valid UsuarioRequestDTO dados) {
        // Convertendo DTO para Entity
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(dados.nome());
        novoUsuario.setEmail(dados.email());
        novoUsuario.setSenha(dados.senha()); // Aqui você poderia aplicar o BCrypt depois

        Usuario usuarioSalvo = repository.save(novoUsuario);

        // Retornando o DTO de Resposta (Sem a senha!)
        return ResponseEntity.status(HttpStatus.CREATED).body(new UsuarioResponseDTO(usuarioSalvo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(usuario -> ResponseEntity.ok(new UsuarioResponseDTO(usuario)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody @Valid UsuarioUpdateDTO dados) {
        return repository.findById(id).map(usuario -> {
            // Regra de E-mail Único:
            var usuarioExistente = repository.findByEmail(dados.email());

            // Se o e-mail já existe E não pertence a este ID que estamos editando
            if (usuarioExistente.isPresent() && !usuarioExistente.get().getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Erro: O e-mail " + dados.email() + " já está em uso por outro usuário.");
            }

            // Atualiza os campos da Entity
            usuario.setNome(dados.nome());
            usuario.setEmail(dados.email());
            // Só atualiza a senha se ela não vier nula ou vazia
            if (dados.senha() != null && !dados.senha().isBlank()) {
                usuario.setSenha(dados.senha());
            }

            repository.save(usuario);
            return ResponseEntity.ok(new UsuarioResponseDTO(usuario));

        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        return repository.findById(id).map(usuario -> {
            repository.delete(usuario);
            return ResponseEntity.noContent().<Void>build(); // Retorna 204
        }).orElse(ResponseEntity.notFound().build()); // Retorna 404 se não existir
    }

}
