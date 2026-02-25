package com.cadastro.demonstrativo.controller;

import com.cadastro.demonstrativo.dto.DadosTokenDTO;
import com.cadastro.demonstrativo.dto.LoginRequestDTO;
import com.cadastro.demonstrativo.dto.UsuarioResponseDTO;
import com.cadastro.demonstrativo.repository.UsuarioRepository;
import com.cadastro.demonstrativo.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository repository;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDTO dados) {
        var usuarioOptional = repository.findByEmail(dados.email());

        if (usuarioOptional.isPresent()) {
            var usuario = usuarioOptional.get();
            if (encoder.matches(dados.senha(), usuario.getSenha())) {
                // GERA O TOKEN
                String token = tokenService.gerarToken(usuario);

                // Retorna o Token + Dados básicos para o React
                return ResponseEntity.ok(new DadosTokenDTO(
                        token,
                        usuario.getId(),
                        usuario.getNome(),
                        usuario.getPerfil()
                ));
            }
        }
        throw new RuntimeException("E-mail ou senha inválidos.");
    }


}

