package com.cadastro.demonstrativo.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Linha de Comando API").version("6.0"))
                // Configura o Swagger para aceitar o Token JWT (Bearer)
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("1-Publico")
                .pathsToMatch("/", "/posts", "/auth/login") // Endpoints liberados
                .build();
    }

    @Bean
    public GroupedOpenApi colaboradorApi() {
        return GroupedOpenApi.builder()
                .group("2-Colaborador")
                .pathsToMatch("/posts/**", "/meus-posts") // Exclui o que for /admin
                .pathsToExclude("/posts/admin/**")
                .build();
    }

    @Bean
    public GroupedOpenApi adminApi() {
        return GroupedOpenApi.builder()
                .group("3-Admin")
                .pathsToMatch("/usuarios/**", "/posts/admin/**") // Gestão total
                .build();
    }
}

