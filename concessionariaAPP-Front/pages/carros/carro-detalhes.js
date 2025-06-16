const API_URL = "http://localhost:8080";

// Carrega os detalhes do carro selecionado
async function carregarDetalhes() {
  const urlParams = new URLSearchParams(window.location.search);
  const carroId = urlParams.get("id");

  // Se não houver ID, redireciona para a página inicial
  if (!carroId) {
    window.location.href = "../../index.html";
    return;
  }

  try {
    // Busca os dados do carro na API
    const response = await fetch(`${API_URL}/carros/${carroId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Carro não encontrado");
    }

    const carro = await response.json();
    const userScope = getUserScope();
    const isVendedor = userScope === "VENDEDOR";

    // Monta o HTML com os detalhes do carro
    const container = document.getElementById("detalhes-carro");
    container.innerHTML = `
            <div class="carro-detalhes">
                <div class="carro-header">
                    <div class="carro-titulo">
                        <h1>${carro.marca} ${carro.modelo}</h1>
                        <p>Código: ${carro.id}</p>
                    </div>
                    <div class="carro-preco">
                        R$ ${carro.preco.toLocaleString("pt-BR")}
                    </div>
                </div>

                <div class="carro-info">
                    <div class="info-item">
                        <div class="info-label">Ano</div>
                        <div class="info-value">${carro.ano}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Status</div>
                        <div class="info-value">${
                          carro.disponivel ? "Disponível" : "Indisponível"
                        }</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Data de Cadastro</div>
                        <div class="info-value">${new Date(
                          carro.criado_em
                        ).toLocaleDateString("pt-BR")}</div>
                    </div>
                </div>

                <div class="carro-descricao">
                    <h3>Descrição</h3>
                    <p>${carro.descricao}</p>
                </div>

                <div class="vendedor-info">
                    <h3>Informações do Vendedor</h3>
                    <p>Nome: ${carro.usuario.nome}</p>
                    <p>Email: ${carro.usuario.email}</p>
                </div>

                ${
                  // Se for vendedor, exibe botões de editar/deletar e formulário de edição
                  isVendedor
                    ? `
                    <div class="acoes-container">
                        <button class="btn btn-editar" onclick="toggleEditForm()">Editar</button>
                        <button class="btn btn-deletar" onclick="deletarCarro(${carro.id})">Deletar</button>
                    </div>

                    <form id="editForm" class="form-edit">
                        <div class="form-group">
                            <label for="marca">Marca</label>
                            <input type="text" id="marca" value="${carro.marca}" required>
                        </div>
                        <div class="form-group">
                            <label for="modelo">Modelo</label>
                            <input type="text" id="modelo" value="${carro.modelo}" required>
                        </div>
                        <div class="form-group">
                            <label for="ano">Ano</label>
                            <input type="number" id="ano" value="${carro.ano}" required>
                        </div>
                        <div class="form-group">
                            <label for="preco">Preço</label>
                            <input type="number" id="preco" value="${carro.preco}" required>
                        </div>
                        <div class="form-group">
                            <label for="descricao">Descrição</label>
                            <textarea id="descricao" required>${carro.descricao}</textarea>
                        </div>
                        <button type="submit" class="btn btn-editar">Salvar Alterações</button>
                    </form>
                `
                    : ""
                }
            </div>
        `;

    // Se for vendedor, adiciona evento para o formulário de edição
    if (isVendedor) {
      document
        .getElementById("editForm")
        .addEventListener("submit", (e) => atualizarCarro(e, carro.id));
    }
  } catch (error) {
    console.error("Erro:", error);
    alert(error.message);
  }
}

// Retorna o papel do usuário logado a partir do token JWT
function getUserScope() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.scope || null;
  } catch (error) {
    return null;
  }
}

// Mostra ou esconde o formulário de edição
function toggleEditForm() {
  const form = document.getElementById("editForm");
  form.style.display = form.style.display === "none" ? "block" : "none";
}

// Atualiza os dados do carro na API
async function atualizarCarro(e, carroId) {
  e.preventDefault();

  const dadosAtualizados = {
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    ano: parseInt(document.getElementById("ano").value),
    preco: parseFloat(document.getElementById("preco").value),
    descricao: document.getElementById("descricao").value,
  };

  try {
    const response = await fetch(`${API_URL}/vendedor/carros/${carroId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(dadosAtualizados),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Erro ao atualizar carro");
    }

    alert("Carro atualizado com sucesso!");
    window.location.reload();
  } catch (error) {
    alert(error.message);
  }
}

// Deleta o carro selecionado após confirmação
async function deletarCarro(carroId) {
  if (!confirm("Tem certeza que deseja deletar este carro?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/vendedor/carros/${carroId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || "Erro ao deletar carro");
    }

    alert("Carro deletado com sucesso!");
    window.location.href = "../../index.html";
  } catch (error) {
    console.error("Erro completo:", error);
    alert(error.message);
  }
}

// Inicializa a tela ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  verificarToken();
  carregarDetalhes();
});
