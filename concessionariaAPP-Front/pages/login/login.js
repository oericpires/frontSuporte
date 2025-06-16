const API_URL = "http://localhost:8080";

// Alterna entre o formulário de login e o de registro
function toggleForm(formType) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (formType === "register") {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
  } else {
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  }
}

// Lida com o envio do formulário de login
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginPassword").value;

  try {
    // Envia requisição de login para a API
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Erro ao fazer login");
    }

    // Salva o token JWT no localStorage
    const token = await response.text();
    localStorage.setItem("token", token);

    // Redireciona para a página inicial
    window.location.href = "../../index.html";
  } catch (error) {
    showError("loginForm", error.message);
  }
}

// Lida com o envio do formulário de registro
async function handleRegister(e) {
  e.preventDefault();

  const nome = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const senha = document.getElementById("registerPassword").value;

  try {
    // Envia requisição de cadastro para a API
    const response = await fetch(`${API_URL}/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, email, senha }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Erro ao criar conta");
    }

    // Mostra mensagem de sucesso e alterna para o formulário de login
    toggleForm("login");
    showError("loginForm", "Conta criada com sucesso! Faça login.", "success");
  } catch (error) {
    showError("registerForm", error.message);
  }
}

// Exibe mensagens de erro ou sucesso nos formulários
function showError(formId, message, type = "error") {
  const form = document.getElementById(formId);
  let errorDiv = form.querySelector(".error-message");

  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    form.appendChild(errorDiv);
  }

  errorDiv.textContent = message;
  errorDiv.style.color = type === "success" ? "#2e7d32" : "#d32f2f";
}

// Função utilitária para requisições autenticadas
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Erro na requisição");
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

// Adiciona eventos aos formulários de login e registro
document.getElementById("loginForm").addEventListener("submit", handleLogin);
document
  .getElementById("registerForm")
  .addEventListener("submit", handleRegister);
