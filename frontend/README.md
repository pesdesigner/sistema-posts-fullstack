# 🚀 Sistema de Cadastro Full Stack (v7.0.0)

Sistema moderno de gerenciamento de usuários desenvolvido com **Java 21** e **React 18**.

## 🛠️ Tecnologias
- **Back-end:** Spring Boot 4.0.3, Java 21, Spring Data JPA, MySQL 8.
- **Front-end:** React, Tailwind CSS v4, Axios, React Router.
- **Infra:** Docker & Docker Compose.

## 📦 Como Executar

### 1. Banco de Dados e API
Navegue até a pasta da API e execute:
```bash
docker-compose up -d --build

## 🔍 Troubleshooting (Resolução de Problemas)

### 1. A API não conecta ao Banco de Dados
Se você visualizar o erro `Communications link failure` nos logs da API, siga estes passos:
* **Ordem de Inicialização:** O container do MySQL deve estar no status `healthy` antes da API subir. Tente rodar `docker-compose up -d mysql-db` primeiro, aguarde 15 segundos e então suba a API.
* **Rede Docker:** Verifique se ambos os containers estão na mesma rede com o comando `docker network inspect [NOME_DA_REDE]`.
* **Host no application.properties:** Certifique-se de que a URL de conexão usa o nome do serviço (ex: `jdbc:mysql://mysql-db:3306/...`) e não `localhost`.

### 2. Erro de CORS no Navegador
Se o Front-end não conseguir listar ou deletar usuários (mesmo com a API rodando):
* Verifique se a classe `WebConfig.java` na API possui o `@Configuration` e permite os métodos `GET, POST, PUT, DELETE`.
* Limpe o cache do navegador ou teste em uma janela anônima.

### 3. Falha no Build do Maven (MalformedInputException)
Se o Docker falhar ao compilar o Java:
* Certifique-se de que o arquivo `application.properties` está salvo com a codificação **UTF-8** (sem BOM).

