# AutoTop - Sistema de Gerenciamento de Concessionária

## Descrição

Sistema web para gerenciamento de uma concessionária de carros, permitindo o cadastro, visualização, edição e remoção de veículos, além de gerenciamento de usuários com diferentes níveis de acesso.

## Funcionalidades

### Autenticação e Autorização

- Login com JWT
- Registro de novos usuários
- 3 níveis de acesso:
  - USUARIO (padrão)
  - VENDEDOR
  - ADMINISTRADOR

### Gerenciamento de Carros

- Listagem de carros disponíveis
- Visualização detalhada de cada veículo
- Cadastro de novos carros (VENDEDOR)
- Edição de informações (VENDEDOR)
- Remoção de carros (VENDEDOR)

### Gerenciamento de Usuários (ADMINISTRADOR)

- Listagem de todos os usuários
- Alteração de cargos
- Remoção de usuários

## Tecnologias Utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript (Vanilla)

### Backend

- Java Spring Boot
- Spring Security com JWT
- PostgreSQL

## Pré-requisitos

- Node.js para servidor local frontend
- Java 17+
- PostgreSQL
- Maven

## Configuração

### Backend

1. Clone o repositório
2. Configure o banco de dados no `application.properties`
3. Execute:

```bash
mvn clean install
mvn spring-boot:run
```

### Frontend

1. Instale um servidor local (como Live Server no VS Code)
2. Abra o projeto no VS Code
3. Inicie o Live Server

## Estrutura do Projeto

```
concessionariaAPP/
├── index.html
├── styles.css
├── js.js
├── pages/
│   ├── admin/
│   │   ├── admin.html
│   │   ├── admin.css
│   │   └── admin.js
│   ├── carros/
│   │   ├── carro-detalhes.html
│   │   ├── carro-detalhes.css
│   │   └── carro-detalhes.js
│   ├── login/
│   │   ├── login.html
│   │   ├── login.css
│   │   └── login.js
│   ├── usuario/
│   │   ├── perfil.html
│   │   ├── perfil.css
│   │   └── perfil.js
│   └── vendedor/
│       ├── vendedor.html
│       ├── vendedor.css
│       └── vendedor.js
```

## Endpoints da API

### Públicos

- `POST /login` - Autenticação
- `POST /registrar` - Registro de usuário
- `GET /carros` - Lista todos os carros
- `GET /carros/{id}` - Detalhes de um carro

### Vendedor

- `POST /vendedor/carros` - Cadastra novo carro
- `PUT /vendedor/carros/{id}` - Atualiza carro
- `DELETE /vendedor/carros/{id}` - Remove carro

### Administrador

- `GET /admin/usuarios` - Lista todos usuários
- `PUT /admin/usuarios/{id}/cargo` - Altera cargo
- `DELETE /admin/usuarios/{id}` - Remove usuário

## Autor

- Eric Pires

