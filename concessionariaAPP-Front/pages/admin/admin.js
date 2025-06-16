const API_URL = "http://localhost:8080";

// Carrega todos os usuários e exibe na tela
async function carregarUsuarios() {
  try {
    // Faz requisição autenticada para buscar usuários
    const response = await fetch(`${API_URL}/admin/usuarios`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar usuários");
    }

    const usuarios = await response.json();
    const container = document.getElementById("users-container");
    container.innerHTML = "";

    // Cria um card para cada usuário
    usuarios.forEach((usuario) => {
      const card = criarCardUsuario(usuario);
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert(error.message);
  }
}

// Cria o card HTML de um usuário
function criarCardUsuario(usuario) {
  const div = document.createElement("div");
  div.className = "user-card";

  div.innerHTML = `
        <div class="user-info">
            <h3>${usuario.nome}</h3>
            <p>Email: ${usuario.email}</p>
            <p>Cargo atual: ${usuario.cargo}</p>
        </div>
        <div class="user-actions">
            <select class="role-select" id="role-${usuario.id}">
                <option value="USUARIO" ${
                  usuario.cargo === "USUARIO" ? "selected" : ""
                }>Usuário</option>
                <option value="VENDEDOR" ${
                  usuario.cargo === "VENDEDOR" ? "selected" : ""
                }>Vendedor</option>
                <option value="ADMINISTRADOR" ${
                  usuario.cargo === "ADMINISTRADOR" ? "selected" : ""
                }>Administrador</option>
            </select>
            <button class="btn btn-role" onclick="alterarCargo('${
              usuario.id
            }')">
                Alterar Cargo
            </button>
            <button class="btn btn-delete" onclick="deletarUsuario('${
              usuario.id
            }')">
                Excluir
            </button>
        </div>
    `;

  return div;
}

// Altera o cargo do usuário selecionado
async function alterarCargo(userId) {
  const novoCargoSelect = document.getElementById(`role-${userId}`);
  const novoCargo = novoCargoSelect.value;

  try {
    // Requisição para alterar o cargo do usuário
    const response = await fetch(
      `${API_URL}/admin/usuarios/${userId}/cargo?cargo=${novoCargo}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const erro = await response.text();
      throw new Error(erro);
    }

    alert("Cargo alterado com sucesso!");
    await carregarUsuarios();
  } catch (error) {
    alert(error.message);
  }
}

// Exclui o usuário selecionado após confirmação
async function deletarUsuario(userId) {
  if (
    !confirm(
      "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
    )
  ) {
    return;
  }

  try {
    // Requisição para deletar o usuário
    const response = await fetch(`${API_URL}/admin/usuarios/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const erro = await response.text();
      throw new Error(erro);
    }

    alert("Usuário excluído com sucesso!");
    await carregarUsuarios();
  } catch (error) {
    alert(error.message);
  }
}

// Inicializa a tela ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  verificarToken(); // Função global para navbar
  carregarUsuarios();
});
