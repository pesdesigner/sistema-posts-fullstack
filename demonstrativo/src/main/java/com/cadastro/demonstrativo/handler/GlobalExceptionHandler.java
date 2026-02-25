package com.cadastro.demonstrativo.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Captura erros de validação (@Valid, @NotBlank, etc)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> tratarErroValidacao(MethodArgumentNotValidException ex) {
        var erros = ex.getFieldErrors();
        Map<String, String> mapaErros = new HashMap<>();
        for (var erro : erros) {
            mapaErros.put(erro.getField(), erro.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(mapaErros);
    }

    // 2. Captura erros de lógica (como o post duplicado que vamos criar)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> tratarErroRegraNegocio(RuntimeException ex) {
        Map<String, String> erro = new HashMap<>();
        erro.put("mensagem", ex.getMessage());
        return ResponseEntity.badRequest().body(erro);
    }
}

