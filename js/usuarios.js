import {
  fetchUsers,
  cadastrarUsuario,
  atualizarUsuario,
  excluirUsuario,
} from "/services/usuariosService";

const usuariosPorPagina = 6;
let paginaAtual = 1;
let todosOsUsuarios = [];
let idUsuarioEditando = null;
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
const registerPasswordInput = document.getElementById("register-password");
const registerPermissionInput = document.getElementById("register-permission");
const updateNameInput = document.getElementById("update-name");
const updateEmailInput = document.getElementById("update-email");
const updatePasswordInput = document.getElementById("update-password");
const updatePermissionInput = document.getElementById("update-permission");
const addUserBtn = document.getElementById("add-user-btn");
const cancelarBtns = document.querySelectorAll(".btn-secondary");
const fecharBtns = document.querySelectorAll(".close-modal-btn");
const confirmDeleteBtn = modalConfirmando.querySelector(".btn-primary");
const toggleNav = document.getElementById("toggle-nav");
const nav = document.getElementById("navbar");
const profileButton = document.getElementById("profile-button");
const profileModal = document.getElementById("profile-modal");

const renderTable = (usuariosParaExibir, pagina = 1) => {
  tableBody.innerHTML = "";

  const inicio = (pagina - 1) * usuariosPorPagina;
  const fim = inicio + usuariosPorPagina;
  const usuariosPaginados = usuariosParaExibir.slice(inicio, fim);

  if (usuariosPaginados.length === 0 && pagina > 1) {
    paginaAtual = Math.max(1, paginaAtual - 1);
    renderTable(usuariosParaExibir, paginaAtual);
    return;
  }

  usuariosPaginados.forEach((user) => {
    const tr = tableBody.insertRow();
    tr.innerHTML = `
        <td data-label="Nome">${user.name}</td>
        <td data-label="Email">${user.email}</td>
        <td data-label="Senha">********</td>
        <td data-label="Permissão">${
          user.role === "ADMIN" ? "Usuário Editor" : "Usuário Leitor"
        }</td>
        <td data-label="Ações">
          <button class="action-btn edit-btn" data-id="${user.id}">
            <span class="material-icons-outlined">edit</span>
          </button>
          <button class="action-btn delete-btn" data-id="${user.id}">
            <span class="material-icons-outlined">delete</span>
          </button>
        </td>
      `;
  });

  if (usuariosParaExibir.length === 0) {
    mensagemErro.style.display = "block";
    mensagemErro.textContent = "Nenhum usuário encontrado.";
    paginacaoContainer.innerHTML = "";
  } else {
    mensagemErro.style.display = "none";
    renderPaginacao(usuariosParaExibir);
  }
};

const renderPaginacao = (usuarios) => {
  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);
  paginacaoContainer.innerHTML = "";

  const btnAnterior = document.createElement("button");
  btnAnterior.innerText = "Anterior";
  btnAnterior.disabled = paginaAtual === 1;
  btnAnterior.classList.add("page-btn");
  btnAnterior.addEventListener("click", () => {
    paginaAtual--;
    renderTable(usuarios, paginaAtual);
  });

  paginacaoContainer.appendChild(btnAnterior);

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.classList.add("page-btn");
    if (i === paginaAtual) btn.classList.add("active");
    btn.addEventListener("click", () => {
      paginaAtual = i;
      renderTable(usuarios, paginaAtual);
    });
    paginacaoContainer.appendChild(btn);
  }

  const btnProximo = document.createElement("button");
  btnProximo.innerText = "Próximo";
  btnProximo.disabled = paginaAtual === totalPaginas;
  btnProximo.classList.add("page-btn");
  btnProximo.addEventListener("click", () => {
    paginaAtual++;
    renderTable(usuarios, paginaAtual);
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
  idUsuarioEditando = null;
  idParaExcluir = null;
  formCadastrar.reset();
  formAtualizar.reset();
};

const carregarUsuarios = async () => {
  try {
    todosOsUsuarios = await fetchUsers();
    renderTable(todosOsUsuarios, paginaAtual);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    mensagemErro.style.display = "block";
    mensagemErro.textContent = "Erro ao carregar usuários.";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  carregarUsuarios();

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filteredUsers = todosOsUsuarios.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
      );
    });
    paginaAtual = 1;
    renderTable(filteredUsers, paginaAtual);
  });

  addUserBtn.addEventListener("click", () => openModal(modalCadastrar));

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
    const newUser = {
      name: registerNameInput.value.trim(),
      email: registerEmailInput.value.trim(),
      password: registerPasswordInput.value.trim(),
      role: registerPermissionInput.value.trim(),
    };
    try {
      await cadastrarUsuario(newUser);
      closeModal(modalCadastrar);
      openModal(modalCadastrando);
      setTimeout(() => closeModal(modalCadastrando), 1500);
      await carregarUsuarios();
      searchInput.value = "";
      paginaAtual = 1;
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Erro ao cadastrar usuário.");
    }
  });

  formAtualizar.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (idUsuarioEditando === null) return;

    const updatedUser = {
      name: updateNameInput.value.trim(),
      email: updateEmailInput.value.trim(),
      role: updatePermissionInput.value.trim(),
    };

    try {
      await atualizarUsuario(idUsuarioEditando, updatedUser);
      closeModal(modalAtualizar);
      openModal(modalAtualizando);
      setTimeout(() => closeModal(modalAtualizando), 1500);
      await carregarUsuarios();
      searchInput.value = "";
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar usuário.");
    }
  });

  tableBody.addEventListener("click", (event) => {
    const editBtn = event.target.closest(".edit-btn");
    const deleteBtn = event.target.closest(".delete-btn");

    if (editBtn) {
      const userId = parseInt(editBtn.dataset.id, 10);
      idUsuarioEditando = userId;
      const userToEdit = todosOsUsuarios.find((u) => u.id === userId);
      if (userToEdit) {
        updateNameInput.value = userToEdit.name;
        updateEmailInput.value = userToEdit.email;
        updatePasswordInput.value = "";
        updatePermissionInput.value = userToEdit.role;
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
        await excluirUsuario(idParaExcluir);
        closeModal(modalConfirmando);
        openModal(modalDeletando);
        setTimeout(() => closeModal(modalDeletando), 1500);
        await carregarUsuarios();
        searchInput.value = "";
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Erro ao excluir usuário.");
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
