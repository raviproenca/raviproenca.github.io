import axios from "axios";

// --- Configurações Iniciais e Variáveis Globais ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token");
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

// --- Funções de Renderização e UI ---
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
    console.log("Renderizando usuário:", user);
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

// --- Funções de Interação com a API (Axios) ---
const fetchUsers = async () => {
  try {
    const token = getToken();
    if (!token) {
      console.error(
        "Token de autenticação não encontrado. Redirecionando para login."
      );
      window.location.href = "/";
      return;
    }

    const response = await axios.get(`${API_BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    todosOsUsuarios = response.data;
    renderTable(todosOsUsuarios, paginaAtual);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    mensagemErro.style.display = "block";
    mensagemErro.textContent =
      "Não foi possível carregar os usuários. Verifique sua conexão ou faça login novamente.";
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

const cadastrarUsuario = async (userData) => {
  try {
    const token = getToken();
    if (!token) {
      return;
    }

    const response = await axios.post(`${API_BASE_URL}/user`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    closeModal(modalCadastrar);
    openModal(modalCadastrando);
    setTimeout(() => closeModal(modalCadastrando), 1500);

    await fetchUsers();
    searchInput.value = "";
    paginaAtual = 1;
    renderTable(todosOsUsuarios, paginaAtual);
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    alert(
      "Erro ao cadastrar usuário: " +
        (error.response?.data?.message ||
          "Verifique os dados ou tente novamente.")
    );
  }
};

const atualizarUsuario = async (userId, userData) => {
  try {
    const token = getToken();
    if (!token) {
      return;
    }

    const response = await axios.put(
      `${API_BASE_URL}/user/${userId}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    closeModal(modalAtualizar);
    openModal(modalAtualizando);
    setTimeout(() => closeModal(modalAtualizando), 1500);

    await fetchUsers();
    searchInput.value = "";
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    alert(
      "Erro ao atualizar usuário: " +
        (error.response?.data?.message ||
          "Verifique os dados ou tente novamente.")
    );
  }
};

const excluirUsuario = async (userId) => {
  try {
    const token = getToken();
    if (!token) {
      return;
    }

    await axios.delete(`${API_BASE_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    closeModal(modalConfirmando);
    openModal(modalDeletando);
    setTimeout(() => closeModal(modalDeletando), 1500);

    await fetchUsers();
    searchInput.value = "";
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    alert(
      "Erro ao excluir usuário: " +
        (error.response?.data?.message || "Ocorreu um erro ao tentar excluir.")
    );
  }
};

// --- Gerenciamento de Eventos ---
document.addEventListener("DOMContentLoaded", () => {
  fetchUsers();

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

  registerNameInput.addEventListener("input", () => {
    if (
      registerNameInput.value.trim().length < 3 ||
      registerNameInput.value.trim().length > 30
    ) {
      registerNameInput.setCustomValidity("Por favor, insira um nome válido.");
    } else {
      registerNameInput.setCustomValidity("");
    }
  });

  registerEmailInput.addEventListener("input", () => {
    if (
      registerEmailInput.validity.typeMismatch ||
      registerEmailInput.value.trim().length < 7 ||
      registerEmailInput.value.trim().length > 50
    ) {
      registerEmailInput.setCustomValidity(
        "Por favor, insira um email válido."
      );
    } else {
      registerEmailInput.setCustomValidity("");
    }
  });

  registerPasswordInput.addEventListener("input", () => {
    if (registerPasswordInput.value.trim().length < 8) {
      registerPasswordInput.setCustomValidity(
        "A senha deve possui no mínimo 8 dígitos"
      );
    } else if (registerPasswordInput.value.trim().length > 30) {
      registerPasswordInput.setCustomValidity(
        "Por favor, insira uma senha válida."
      );
    } else {
      registerPasswordInput.setCustomValidity("");
    }
  });

  formCadastrar.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!registerNameInput.value.trim()) {
      registerNameInput.setCustomValidity("O nome é obrigatório.");
      registerNameInput.reportValidity();
      return;
    }

    if (!registerEmailInput.value.trim()) {
      registerEmailInput.setCustomValidity("O email é obrigatório.");
      registerEmailInput.reportValidity();
      return;
    }

    if (!registerPasswordInput.value.trim()) {
      registerPasswordInput.setCustomValidity("A senha é obrigatória.");
      registerPasswordInput.reportValidity();
      return;
    }

    if (
      registerNameInput.value.trim().length < 3 ||
      registerNameInput.value.trim().length > 30
    ) {
      registerNameInput.setCustomValidity("Por favor, insira um nome válido.");
      registerNameInput.reportValidity();
      return;
    }

    if (
      registerEmailInput.validity.typeMismatch ||
      registerEmailInput.value.trim().length < 7 ||
      registerEmailInput.value.trim().length > 50
    ) {
      registerEmailInput.setCustomValidity(
        "Por favor, insira um email válido."
      );
      registerEmailInput.reportValidity();
      return;
    }

    if (registerPasswordInput.value.trim().length < 8) {
      registerPasswordInput.setCustomValidity(
        "A senha deve possui no mínimo 8 dígitos"
      );
    } else if (registerPasswordInput.value.trim().length > 30) {
      registerPasswordInput.setCustomValidity(
        "Por favor, insira uma senha válida."
      );
      registerPasswordInput.reportValidity();
      return;
    }

    const emailExistente = todosOsUsuarios.some(
      (usuario) =>
        usuario.email.toLowerCase() ===
        registerEmailInput.value.trim().toLowerCase()
    );

    if (emailExistente) {
      registerEmailInput.setCustomValidity(
        "Já existe um locatário com este e-mail."
      );
      registerEmailInput.reportValidity();
      return;
    }

    const nomeExistente = todosOsUsuarios.some(
      (usuario) =>
        usuario.name.toLowerCase() ===
        registerNameInput.value.trim().toLowerCase()
    );

    if (nomeExistente) {
      registerNameInput.setCustomValidity(
        "Já existe um locatário com este nome."
      );
      registerNameInput.reportValidity();
      return;
    }

    const newUser = {
      name: registerNameInput.value.trim(),
      email: registerEmailInput.value.trim(),
      password: registerPasswordInput.value.trim(),
      role: registerPermissionInput.value.trim(),
    };
    await cadastrarUsuario(newUser);
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
      const userId = deleteBtn.dataset.id;
      idParaExcluir = userId;
      openModal(modalConfirmando);
    }
  });

  updateNameInput.addEventListener("input", () => {
    if (
      updateNameInput.value.trim().length < 3 ||
      updateNameInput.value.trim().length > 30
    ) {
      updateNameInput.setCustomValidity("Por favor, insira um nome válido.");
    } else {
      updateNameInput.setCustomValidity("");
    }
  });

  updateEmailInput.addEventListener("input", () => {
    if (
      updateEmailInput.validity.typeMismatch ||
      updateEmailInput.value.trim().length < 7 ||
      updateEmailInput.value.trim().length > 50
    ) {
      updateEmailInput.setCustomValidity("Por favor, insira um email válido.");
    } else {
      updateEmailInput.setCustomValidity("");
    }
  });

  updatePasswordInput.addEventListener("input", () => {
    if (updatePasswordInput.value.trim().length < 8) {
      updatePasswordInput.setCustomValidity(
        "A senha deve possui no mínimo 8 dígitos"
      );
    } else if (updatePasswordInput.value.trim().length > 30) {
      updatePasswordInput.setCustomValidity(
        "Por favor, insira uma senha válida."
      );
    } else {
      updatePasswordInput.setCustomValidity("");
    }
  });

  formAtualizar.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (idUsuarioEditando === null) return;

    if (!updateNameInput.value.trim()) {
      updateNameInput.setCustomValidity("O nome é obrigatório.");
      updateNameInput.reportValidity();
      return;
    }

    if (!updateEmailInput.value.trim()) {
      updateEmailInput.setCustomValidity("O email é obrigatório.");
      updateEmailInput.reportValidity();
      return;
    }

    if (!updatePasswordInput.value.trim()) {
      updatePasswordInput.setCustomValidity("A senha é obrigatória.");
      updatePasswordInput.reportValidity();
      return;
    }

    if (
      updateNameInput.value.trim().length < 3 ||
      updateNameInput.value.trim().length > 30
    ) {
      updateNameInput.setCustomValidity("Por favor, insira um nome válido.");
      updateNameInput.reportValidity();
      return;
    }

    if (
      updateEmailInput.validity.typeMismatch ||
      updateEmailInput.value.trim().length < 7 ||
      updateEmailInput.value.trim().length > 50
    ) {
      updateEmailInput.setCustomValidity("Por favor, insira um email válido.");
      updateEmailInput.reportValidity();
      return;
    }

    if (updatePasswordInput.value.trim().length < 8) {
      updatePasswordInput.setCustomValidity(
        "A senha deve possui no mínimo 8 dígitos"
      );
    } else if (updatePasswordInput.value.trim().length > 30) {
      updatePasswordInput.setCustomValidity(
        "Por favor, insira uma senha válida."
      );
      updatePasswordInput.reportValidity();
      return;
    }

    const emailExistente = todosOsUsuarios.some(
      (usuario) =>
        usuario.email.toLowerCase() ===
        updateEmailInput.value.trim().toLowerCase()
    );

    if (emailExistente) {
      updateEmailInput.setCustomValidity(
        "Já existe um locatário com este e-mail."
      );
      updateEmailInput.reportValidity();
      return;
    }

    const nomeExistente = todosOsUsuarios.some(
      (usuario) =>
        usuario.name.toLowerCase() ===
        updateNameInput.value.trim().toLowerCase()
    );

    if (nomeExistente) {
      updateNameInput.setCustomValidity(
        "Já existe um locatário com este nome."
      );
      updateNameInput.reportValidity();
      return;
    }

    const updatedUser = {
      name: updateNameInput.value.trim(),
      email: updateEmailInput.value.trim(),
      role: updatePermissionInput.value.trim(),
    };

    await atualizarUsuario(idUsuarioEditando, updatedUser);
  });

  confirmDeleteBtn.addEventListener("click", () => {
    if (idParaExcluir !== null) {
      excluirUsuario(idParaExcluir);
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
