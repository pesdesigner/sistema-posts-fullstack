package com.cadastro.demonstrativo;

import com.cadastro.demonstrativo.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemonstrativoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemonstrativoApplication.class, args);
	}
	@Bean
	public CommandLineRunner consoleTest(UsuarioRepository repository) {
		return args -> {
			System.out.println("--- Testando Conexao MySQL ---");
			try {
				// Busca todos os usuarios da tabela
				var lista = repository.findAll();
				System.out.println("Conectado! Usuarios encontrados: " + lista.size());
				lista.forEach(u -> System.out.println("Usuario: " + u.getNome()));
			} catch (Exception e) {
				System.err.println("Erro ao acessar a tabela: " + e.getMessage());
			}
		};
	}
}
