package com.cadastro.demonstrativo.controller;

import com.cadastro.demonstrativo.dto.LoginRequestDTO;
import com.cadastro.demonstrativo.dto.UsuarioResponseDTO;
import com.cadastro.demonstrativo.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository repository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDTO dados) {
        var usuario = repository.findByEmail(dados.email());

        if (usuario.isPresent() && usuario.get().getSenha().equals(dados.senha())) {
            // Se senha bater, retorna os dados do usuário (incluindo o PERFIL)
            return ResponseEntity.ok(new UsuarioResponseDTO(usuario.get()));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha inválidos.");
    }
}

