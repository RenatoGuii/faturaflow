# FaturaFlow Project

Este é um sistema Fullstack de gerenciamento de faturas pessoais, que inclui autenticação via token JWT e oferece funcionalidades para upload, dashboard, listagem e gerenciamento de faturas. O projeto foi desenvolvido com **Next.js** (frontend) e **Spring Boot** (backend), utilizando um banco de dados **PostgreSQL**.

## 🛠 Tecnologias Utilizadas

### Frontend
- **Next.js** com **TypeScript**
- **Tailwind**

### Backend
- **Spring Boot**
- **Spring Security** (JWT)
- **Spring Data JPA**

### Banco de Dados
- **PostgreSQL**

### Outros
- **Swagger** (Documentação da API)
- **Postman** (Testes de API)
- **Docker** (Containerização)
- **Kubernets** (Orquestração)

---

## 🚀 Funcionalidades

- Autenticação e autorização via JWT.
- Crud completo de faturas.
- Diversas representações gráficas das faturas do usuário
- Integração do backend com um banco PostgreSQL.
- Documentação interativa com Swagger.

---

## 🐳 Executando com Docker

Para rodar o projeto utilizando os contêineres disponíveis no Docker Hub, siga os passos abaixo:

### Pré-requisitos
- Certifique-se de ter o **Docker** instalado em sua máquina.
- Clone o Repositório:
```bash
git clone https://github.com/RenatoGuii/faturaflow.git
```

### Passo 1: Baixar os contêineres
Execute o comando abaixo para baixar e rodar os contêineres:

```bash
docker-compose up
```

O arquivo docker-compose.yml já está configurado para:

- Rodar o backend do Spring Boot.
- Rodar o frontend do Next.js.
- Conectar ao banco PostgreSQL.
- Usar o pgadmin para visualização do banco PostgresSQL.


- O frontend estará disponível em http://localhost:3000
- O backend estará disponível em http://localhost:8080


### 📝 Documentação da API
A API está documentada com o Swagger. Após rodar o backend, você pode acessar a documentação interativa com todos os Endpoints pelo link:

http://localhost:8080/swagger-ui/index.html
