const API_URL = "http://localhost:8080";

// Lida com o envio do formulário para cadastrar um novo carro
async function cadastrarCarro(e) {
  e.preventDefault();

  const carro = {
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    ano: parseInt(document.getElementById("ano").value),
    preco: parseFloat(document.getElementById("preco").value),
    descricao: document.getElementById("descricao").value,
  };

  try {
    // Envia requisição para cadastrar o carro na API
    const response = await fetch(`${API_URL}/vendedor/carros`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(carro),
    });

    if (!response.ok) {
      const erro = await response.text();
      throw new Error(erro || "Erro ao cadastrar carro");
    }

    mostrarMensagem("Carro cadastrado com sucesso!", "success");
    document.getElementById("carForm").reset();
  } catch (error) {
    mostrarMensagem(error.message, "error");
  }
}

// Exibe mensagem de sucesso ou erro na tela
function mostrarMensagem(texto, tipo) {
  const container = document.querySelector(".vendedor-container");
  const existingMessage = container.querySelector(
    ".success-message, .error-message"
  );

  if (existingMessage) {
    existingMessage.remove();
  }

  const messageDiv = document.createElement("div");
  messageDiv.className =
    tipo === "success" ? "success-message" : "error-message";
  messageDiv.textContent = texto;

  container.insertBefore(messageDiv, document.querySelector(".car-form"));

  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Inicializa a tela ao carregar a página e adiciona evento ao formulário
document.addEventListener("DOMContentLoaded", verificarToken);
document.getElementById("carForm").addEventListener("submit", cadastrarCarro);
