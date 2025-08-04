// --- views/editoras.js ---
import {
  fetchEditoras,
  cadastrarEditora,
  atualizarEditora,
  excluirEditora,
} from "../services/editorasService";

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

const carregarEditoras = async () => {
  try {
    todasAsEditoras = await fetchEditoras();
    renderTable(todasAsEditoras, paginaAtual);
  } catch (error) {
    console.error("Erro ao buscar editoras:", error);
    mensagemErro.style.display = "block";
    mensagemErro.textContent = "Erro ao carregar editoras.";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  carregarEditoras();

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
    const newEditora = {
      name: registerNameInput.value.trim(),
      email: registerEmailInput.value.trim(),
      telephone: registerTelefoneInput.value.trim(),
      site: registerSiteInput.value.trim() || "",
    };
    try {
      await cadastrarEditora(newEditora);
      closeModal(modalCadastrar);
      openModal(modalCadastrando);
      setTimeout(() => closeModal(modalCadastrando), 1500);
      await carregarEditoras();
      searchInput.value = "";
      paginaAtual = 1;
    } catch (error) {
      console.error("Erro ao cadastrar editora:", error);
      alert("Erro ao cadastrar editora.");
    }
  });

  formAtualizar.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (idEditoraEditando === null) return;

    const updatedEditora = {
      name: updateNameInput.value.trim(),
      email: updateEmailInput.value.trim(),
      telephone: updateTelefoneInput.value.trim(),
      site: updateSiteInput.value.trim() || "",
    };

    try {
      await atualizarEditora(idEditoraEditando, updatedEditora);
      closeModal(modalAtualizar);
      openModal(modalAtualizando);
      setTimeout(() => closeModal(modalAtualizando), 1500);
      await carregarEditoras();
      searchInput.value = "";
    } catch (error) {
      console.error("Erro ao atualizar editora:", error);
      alert("Erro ao atualizar editora.");
    }
  });

  tableBody.addEventListener("click", (event) => {
    const editBtn = event.target.closest(".edit-btn");
    const deleteBtn = event.target.closest(".delete-btn");

    if (editBtn) {
      const editoraId = parseInt(editBtn.dataset.id, 10);
      idEditoraEditando = editoraId;
      const editoraToEdit = todasAsEditoras.find((u) => u.id === editoraId);
      if (editoraToEdit) {
        updateNameInput.value = editoraToEdit.name;
        updateEmailInput.value = editoraToEdit.email;
        updateTelefoneInput.value = editoraToEdit.telephone;
        updateSiteInput.value = editoraToEdit.site || "";
        openModal(modalAtualizar);
      }
    }

    if (deleteBtn) {
      idParaExcluir = parseInt(deleteBtn.dataset.id, 10);
      openModal(modalConfirmando);
    }
  });

  confirmDeleteBtn.addEventListener("click", async () => {
    if (idParaExcluir !== null) {
      try {
        await excluirEditora(idParaExcluir);
        closeModal(modalConfirmando);
        openModal(modalDeletando);
        setTimeout(() => closeModal(modalDeletando), 1500);
        await carregarEditoras();
        searchInput.value = "";
      } catch (error) {
        console.error("Erro ao excluir editora:", error);
        alert("Erro ao excluir editora.");
      }
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
