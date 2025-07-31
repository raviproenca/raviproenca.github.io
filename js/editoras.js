import axios from "axios";

// --- Configurações Iniciais e Variáveis Globais ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token");
const editorasPorPagina = 6;
let paginaAtual = 1;
let todasAsEditoras = [];
let idEditoraEditando = null;
let idParaExcluir = null;

// --- Seleção de Elementos do DOM ---
const tableBody = document.querySelector("#users-table tbody");
const paginacaoContainer = document.getElementById("pagination");
const searchInput = document.getElementById("search-input");
const mensagemErro = document.getElementById("mensagem-erro");
const modalOverlay = document.getElementById("modal-overlay");
const modalCadastrar = document.getElementById("modal-cadastrar");
const modalAtualizar = document.getElementById("modal-atualizar");
const modalCadastrando = document.getElementById("modal-cadastrando");
const modalAtualizando = document.getElementById("modal-atualizando");
const modalConfirmando = document.getElementById("modal-confirmando");
const modalDeletando = document.getElementById("modal-deletando");
const formCadastrar = document.getElementById("form-cadastrar");
const formAtualizar = document.getElementById("form-atualizar");
const registerNameInput = document.getElementById("register-name");
const registerEmailInput = document.getElementById("register-email");
const registerTelefoneInput = document.getElementById("register-telefone");
const registerSiteInput = document.getElementById("register-site");
const updateNameInput = document.getElementById("update-name");
const updateEmailInput = document.getElementById("update-email");
const updateTelefoneInput = document.getElementById("update-telefone");
const updateSiteInput = document.getElementById("update-site");
const addEditoraBtn = document.getElementById("add-user-btn");
const cancelarBtns = document.querySelectorAll(".btn-secondary");
const fecharBtns = document.querySelectorAll(".close-modal-btn");
const confirmDeleteBtn = modalConfirmando.querySelector(".btn-primary");
const toggleNav = document.getElementById("toggle-nav");
const nav = document.getElementById("navbar");
const profileButton = document.getElementById("profile-button");
const profileModal = document.getElementById("profile-modal");

// --- Funções de Renderização e UI ---
const renderTable = (editorasParaExibir, pagina = 1) => {
  tableBody.innerHTML = "";

  const inicio = (pagina - 1) * editorasPorPagina;
  const fim = inicio + editorasPorPagina;
  const editorasPaginadas = editorasParaExibir.slice(inicio, fim);

  if (editorasPaginadas.length === 0 && pagina > 1) {
    paginaAtual = Math.max(1, paginaAtual - 1);
    renderTable(editorasParaExibir, paginaAtual);
    return;
  }

  editorasPaginadas.forEach((editora) => {
    const tr = tableBody.insertRow();
    tr.innerHTML = `
        <td data-label="Nome">${editora.name}</td>
        <td data-label="Email">${editora.email}</td>
        <td data-label="Telefone">${editora.telephone}</td>
        <td data-label="Site">${editora.site}</td>
        <td data-label="Ações">
          <button class="action-btn edit-btn" data-id="${editora.id}">
            <span class="material-icons-outlined">edit</span>
          </button>
          <button class="action-btn delete-btn" data-id="${editora.id}">
            <span class="material-icons-outlined">delete</span>
          </button>
        </td>
      `;
  });

  if (editorasParaExibir.length === 0) {
    mensagemErro.style.display = "block";
    mensagemErro.textContent = "Nenhuma editora encontrada.";
    paginacaoContainer.innerHTML = "";
  } else {
    mensagemErro.style.display = "none";
    renderPaginacao(editorasParaExibir);
  }
};

const renderPaginacao = (editoras) => {
  const totalPaginas = Math.ceil(editoras.length / editorasPorPagina);
  paginacaoContainer.innerHTML = "";

  const btnAnterior = document.createElement("button");
  btnAnterior.innerText = "Anterior";
  btnAnterior.disabled = paginaAtual === 1;
  btnAnterior.classList.add("page-btn");
  btnAnterior.addEventListener("click", () => {
    paginaAtual--;
    renderTable(editoras, paginaAtual);
  });
  paginacaoContainer.appendChild(btnAnterior);

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.classList.add("page-btn");
    if (i === paginaAtual) btn.classList.add("active");
    btn.addEventListener("click", () => {
      paginaAtual = i;
      renderTable(editoras, paginaAtual);
    });
    paginacaoContainer.appendChild(btn);
  }

  const btnProximo = document.createElement("button");
  btnProximo.innerText = "Próximo";
  btnProximo.disabled = paginaAtual === totalPaginas;
  btnProximo.classList.add("page-btn");
  btnProximo.addEventListener("click", () => {
    paginaAtual++;
    renderTable(editoras, paginaAtual);
  });
  paginacaoContainer.appendChild(btnProximo);
};

const openModal = (modalElement) => {
  modalOverlay.classList.add("is-open");
  modalElement.classList.add("is-open");
};

const closeModal = (modalElement) => {
  modalElement.classList.remove("is-open");
  modalOverlay.classList.remove("is-open");
  idEditoraEditando = null;
  idParaExcluir = null;
  formCadastrar.reset();
  formAtualizar.reset();
};

// --- Funções de Interação com a API (Axios) ---
const fetchEditoras = async () => {
  try {
    const token = getToken();
    if (!token) {
      console.error(
        "Token de autenticação não encontrado. Redirecionando para login."
      );
      window.location.href = "/";
      return;
    }

    const response = await axios.get(`${API_BASE_URL}/publisher`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    todasAsEditoras = response.data;
    renderTable(todasAsEditoras, paginaAtual);
  } catch (error) {
    console.error("Erro ao buscar editoras:", error);
    mensagemErro.style.display = "block";
    mensagemErro.textContent =
      "Não foi possível carregar as editoras. Verifique sua conexão ou faça login novamente.";
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      alert(
        "Sessão expirada ou não autorizada. Por favor, faça login novamente."
      );
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }
};

const cadastrarEditora = async (editoraData) => {
  try {
    const token = getToken();
    if (!token) {
      return;
    }

    const response = await axios.post(
      `${API_BASE_URL}/publisher`,
      editoraData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    closeModal(modalCadastrar);
    openModal(modalCadastrando);
    setTimeout(() => closeModal(modalCadastrando), 1500);

    await fetchEditoras();
    searchInput.value = "";
    paginaAtual = Math.ceil(todasAsEditoras.length / editorasPorPagina);
    renderTable(todasAsEditoras, paginaAtual);
  } catch (error) {
    console.error("Erro ao cadastrar editora:", error);
    alert(
      "Erro ao cadastrar editora: " +
        (error.response?.data?.message ||
          "Verifique os dados ou tente novamente.")
    );
  }
};

const atualizarEditora = async (editoraId, editoraData) => {
  try {
    const token = getToken();
    if (!token) {
      return;
    }

    const response = await axios.put(
      `${API_BASE_URL}/publisher/${editoraId}`,
      editoraData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    closeModal(modalAtualizar);
    openModal(modalAtualizando);
    setTimeout(() => closeModal(modalAtualizando), 1500);

    await fetchEditoras();
    searchInput.value = "";
  } catch (error) {
    console.error("Erro ao atualizar editora:", error);
    alert(
      "Erro ao atualizar editora: " +
        (error.response?.data?.message ||
          "Verifique os dados ou tente novamente.")
    );
  }
};

const excluirEditora = async (editoraId) => {
  try {
    const token = getToken();
    if (!token) {
      return;
    }

    await axios.delete(`${API_BASE_URL}/publisher/${editoraId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    closeModal(modalConfirmando);
    openModal(modalDeletando);
    setTimeout(() => closeModal(modalDeletando), 1500);

    await fetchEditoras();
    searchInput.value = "";
  } catch (error) {
    console.error("Erro ao excluir editora:", error);
    alert(
      "Erro ao excluir editora: " +
        (error.response?.data?.message || "Ocorreu um erro ao tentar excluir.")
    );
  }
};

// --- Gerenciamento de Eventos ---
document.addEventListener("DOMContentLoaded", () => {
  fetchEditoras();

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filteredEditoras = todasAsEditoras.filter((editora) => {
      return (
        editora.name.toLowerCase().includes(searchTerm) ||
        editora.email.toLowerCase().includes(searchTerm) ||
        editora.telephone.toLowerCase().includes(searchTerm) ||
        editora.site.toLowerCase().includes(searchTerm)
      );
    });
    paginaAtual = 1;
    renderTable(filteredEditoras, paginaAtual);
  });

  addEditoraBtn.addEventListener("click", () => openModal(modalCadastrar));

  cancelarBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const modal = event.target.closest(".modal");
      closeModal(modal);
    });
  });
  fecharBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const modal = event.target.closest(".modal");
      closeModal(modal);
    });
  });

  formCadastrar.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (
      !formCadastrar.checkValidity() ||
      !registerNameInput.value.trim() ||
      !registerEmailInput.value.trim() ||
      !registerTelefoneInput.value.trim()
    ) {
      registerNameInput.reportValidity();
      registerEmailInput.reportValidity();
      registerTelefoneInput.reportValidity();
      return;
    }

    const newEditora = {
      name: registerNameInput.value.trim(),
      email: registerEmailInput.value.trim(),
      telephone: registerTelefoneInput.value.trim(),
      site: registerSiteInput.value.trim() || "",
    };
    await cadastrarEditora(newEditora);
  });

  tableBody.addEventListener("click", async (event) => {
    const editBtn = event.target.closest(".edit-btn");
    const deleteBtn = event.target.closest(".delete-btn");

    if (editBtn) {
      const editoraId = editBtn.dataset.id;
      idEditoraEditando = editoraId;

      try {
        const token = getToken();
        if (!token) return;

        const response = await axios.get(
          `${API_BASE_URL}/publisher/${editoraId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const editoraToEdit = response.data;

        if (editoraToEdit) {
          updateNameInput.value = editoraToEdit.name;
          updateEmailInput.value = editoraToEdit.email;
          updateTelefoneInput.value = editoraToEdit.telephone;
          updateSiteInput.value = editoraToEdit.site;
          openModal(modalAtualizar);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da editora para edição:", error);
        alert("Não foi possível carregar os dados da editora para edição.");
      }
    }

    if (deleteBtn) {
      const editoraId = deleteBtn.dataset.id;
      idParaExcluir = editoraId;
      openModal(modalConfirmando);
    }
  });

  formAtualizar.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!formAtualizar.checkValidity() || idEditoraEditando === null) return;

    const updatedEditora = {
      name: updateNameInput.value.trim(),
      email: updateEmailInput.value.trim(),
      telephone: updateTelefoneInput.value.trim(),
      site: updateSiteInput.value.trim() || "",
    };

    await atualizarEditora(idEditoraEditando, updatedEditora);
  });

  confirmDeleteBtn.addEventListener("click", async () => {
    if (idParaExcluir !== null) {
      await excluirEditora(idParaExcluir);
    }
  });

  if (toggleNav && nav) {
    toggleNav.addEventListener("click", (e) => {
      e.stopPropagation();
      nav.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
      if (
        nav.classList.contains("active") &&
        !nav.contains(e.target) &&
        e.target !== toggleNav
      ) {
        nav.classList.remove("active");
      }
    });
  }

  if (profileButton && profileModal) {
    profileButton.addEventListener("click", () => {
      profileModal.classList.toggle("visible");
    });
    document.addEventListener("click", (e) => {
      if (
        !profileButton.contains(e.target) &&
        !profileModal.contains(e.target)
      ) {
        profileModal.classList.remove("visible");
      }
    });
  }
});
