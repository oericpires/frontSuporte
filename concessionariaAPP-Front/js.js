// URL base da API
const url = "http://localhost:8080/";

// Função para verificar o token JWT e atualizar a navbar conforme o papel do usuário
async function verificarToken() {
  const token = localStorage.getItem("token");
  const navbar = document.getElementById("navbar");

  // Verifica se está em uma subpasta para ajustar os links
  const isInSubfolder = window.location.pathname.includes("/pages/");
  const basePath = isInSubfolder ? "../../" : "";

  // Se não houver token, mostra links de Carros e Login
  if (!token) {
    navbar.innerHTML = `
            <a href="${basePath}index.html">Carros</a>
            <a href="${basePath}pages/login/login.html">Login</a>
        `;
    return;
  }

  try {
    // Decodifica o payload do token JWT
    const payload = JSON.parse(atob(token.split(".")[1]));
    const scope = payload.scope || "USUARIO";

    // Link padrão para todos os usuários
    let links = `<a href="${basePath}index.html">Carros</a>`;

    // Adiciona links específicos conforme o papel do usuário
    switch (scope) {
      case "ADMINISTRADOR":
        links += `
                    <a href="${basePath}pages/admin/admin.html">Gerenciar Usuários</a>
                `;
        break;
      case "VENDEDOR":
        links += `
                    <a href="${basePath}pages/vendedor/vendedor.html">Cadastrar Carro</a>
                `;
        break;
      case "USUARIO":
        links += `
                    <a href="${basePath}pages/usuario/perfil.html">Meu Perfil</a>
                `;
        break;
    }

    // Link para logout
    links += `<a href="#" onclick="logout()">Sair</a>`;
    navbar.innerHTML = links;
  } catch (error) {
    // Em caso de erro, remove o token e mostra links de Carros e Login
    console.error("Erro ao verificar token:", error);
    localStorage.removeItem("token");
    navbar.innerHTML = `
            <a href="${basePath}index.html">Carros</a>
            <a href="${basePath}pages/login/login.html">Login</a>
        `;
  }
}

// Função para realizar logout e redirecionar para a página inicial
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");

  const isInSubfolder = window.location.pathname.includes("/pages/");
  const basePath = isInSubfolder ? "../../" : "";
  window.location.href = `${basePath}index.html`;
}

// Função para buscar e exibir os carros disponíveis
async function carregarCarros() {
  try {
    console.log("Iniciando carregamento de carros...");
    const response = await fetch(url + "carros");

    // Verifica se a resposta da API foi bem-sucedida
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const carros = await response.json();
    console.log("Carros recebidos:", carros);

    const carrosContainer = document.getElementById("carros");
    if (!carrosContainer) {
      console.error("Container de carros não encontrado!");
      return;
    }

    carrosContainer.innerHTML = "";

    // Se não houver carros, exibe mensagem
    if (carros.length === 0) {
      carrosContainer.innerHTML = "<p>Nenhum carro disponível no momento.</p>";
      return;
    }

    // Para cada carro, cria um card com as informações
    carros.forEach((carro) => {
      const carroCard = `
                <a href="pages/carros/carro-detalhes.html?id=${
                  carro.id
                }" class="carro-card">
                <img src="${carro.imagem || "carro-completo.jpeg"}">
                    <div class="carro-info">
                        <h3>${carro.marca} ${carro.modelo}</h3>
                        <p class="ano-preco">
                            <span>${carro.ano}</span>
                            <span>R$ ${carro.preco.toLocaleString(
                              "pt-BR"
                            )}</span>
                        </p>
                        <p class="descricao">${
                          carro.descricao || "Sem descrição disponível"
                        }</p>
                    </div>
                </a>
            `;
      carrosContainer.innerHTML += carroCard;
    });
  } catch (error) {
    // Em caso de erro na requisição, exibe mensagem de erro
    console.error("Erro ao carregar os carros:", error);
    const carrosContainer = document.getElementById("carros");
    carrosContainer.innerHTML =
      "<p>Erro ao carregar os carros. Por favor, tente novamente mais tarde.</p>";
  }
}

// Inicializa as funções ao carregar a página
document.addEventListener("DOMContentLoaded", async () => {
  await verificarToken();
  await carregarCarros();
  console.log("Inicialização completa"); // Log para debug
});
