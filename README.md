# 🚀 Sistema de Cadastro & Repositório de Snippets (v7.0)

Este é um projeto **Full Stack** moderno que permite o cadastro de usuários e a postagem de trechos de código (snippets) filtrados por tecnologia.

## 🛠️ Tecnologias Utilizadas

### **Back-end (Pasta /demonstrativo)**
- **Java 21** & **Spring Boot 4.0.3**
- **Spring Data JPA** & **Validation**
- **Lombok** (Produtividade)
- **MySQL 8** (Persistência)

### **Front-end (Pasta /frontend)**
- **React 18** (Vite)
- **Tailwind CSS v4** (Estilização Glassmorphism)
- **Axios** & **React Router Dom**

## 🐳 Como Executar com Docker

1. Certifique-se de ter o **Docker** e o **Docker Compose** instalados.
2. Na raiz do projeto, crie um arquivo `.env` com a senha do banco.

## 📖 Documentação da API (Swagger)
A API conta com documentação interativa e testes em tempo real via OpenAPI 3. Os endpoints estão organizados em grupos de acesso:
Público: Feed de posts e login.
Colaborador: Gestão de snippets próprios.
Admin: Controle total de usuários e moderação de conteúdo.
Para acessar:
Com a aplicação rodando, acesse: http://localhost:8080/swagger-ui.html

Dica: Para testar rotas protegidas no Swagger, clique no botão Authorize (cadeado) e cole o Token JWT gerado no login.

