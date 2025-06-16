const API_URL = "http://localhost:8080";
let originalData = {};

// Carrega os dados do perfil do usuário logado
async function carregarPerfil() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "../../pages/login/login.html";
      return;
    }

    // Busca dados do usuário na API
    const response = await fetch(`${API_URL}/usuario`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar perfil");
    }

    const data = await response.json();
    originalData = { ...data };

    // Preenche os campos do formulário com os dados do usuário
    document.getElementById("nome").value = data.nome;
    document.getElementById("email").value = data.email;
    document.getElementById("cargo").value = data.cargo;

    // Adiciona evento para detectar mudanças nos campos
    ["nome", "email", "senha"].forEach((field) => {
      document
        .getElementById(field)
        .addEventListener("input", verificarMudancas);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert(error.message);
  }
}

// Verifica se houve alteração nos campos para habilitar o botão de salvar
function verificarMudancas() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const mudancas =
    nome !== originalData.nome ||
    email !== originalData.email ||
    senha.length > 0;

  document.getElementById("saveButton").disabled = !mudancas;
}

// Atualiza os dados do perfil do usuário
async function atualizarPerfil(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const dados = {
    nome,
    email,
    senha: senha || null,
  };

  try {
    // Envia requisição para atualizar perfil
    const response = await fetch(`${API_URL}/usuario`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const erro = await response.text();
      throw new Error(erro);
    }

    alert("Perfil atualizado com sucesso!");
    window.location.reload();
  } catch (error) {
    alert(error.message);
  }
}

// Exclui a conta do usuário após confirmação
async function deletarConta() {
  if (
    !confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
    )
  ) {
    return;
  }

  try {
    // Envia requisição para deletar conta
    const response = await fetch(`${API_URL}/usuario`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const erro = await response.text();
      throw new Error(erro);
    }

    localStorage.removeItem("token");
    window.location.href = "../../index.html";
  } catch (error) {
    alert(error.message);
  }
}

// Inicializa a tela ao carregar a página e adiciona eventos aos botões
document.addEventListener("DOMContentLoaded", carregarPerfil);
document
  .getElementById("profileForm")
  .addEventListener("submit", atualizarPerfil);
document.getElementById("deleteButton").addEventListener("click", deletarConta);
