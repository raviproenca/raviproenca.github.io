import axios from "axios";

// --- Configurações Iniciais e Variáveis Globais ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token");
const livrosPorPagina = 6;
let paginaAtual = 1;
let todosOsLivros = [];
let idLivroEditando = null;
let idParaExcluir = null;

// --- Seleção de Elementos do DOM ---
const tableBody = document.querySelector("#books-table tbody");
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
const registerAuthorInput = document.getElementById("register-author");
const registerLaunchInput = document.getElementById("register-launch");
const registerQuantityInput = document.getElementById("register-quantity");
const registerPublisherInput = document.getElementById("register-publisher");
const updateNameInput = document.getElementById("update-name");
const updateAuthorInput = document.getElementById("update-author");
const updateLaunchInput = document.getElementById("update-launch");
const updateQuantityInput = document.getElementById("update-quantity");
const updatePublisherInput = document.getElementById("update-publisher");
const addLivroBtn = document.getElementById("add-book-btn");
const confirmDeleteBtn = modalConfirmando.querySelector(".btn-primary");
const toggleNav = document.getElementById("toggle-nav");
const nav = document.getElementById("navbar");
const profileButton = document.getElementById("profile-button");
const profileModal = document.getElementById("profile-modal");
const publisherSelect = document.getElementById("register-editora");

// --- Funções de Renderização e UI ---
const renderTable = (livros, pagina = 1) => {
  tableBody.innerHTML = "";
  const inicio = (pagina - 1) * livrosPorPagina;
  const fim = inicio + livrosPorPagina;
  const livrosPaginados = livros.slice(inicio, fim);

  if (livrosPaginados.length === 0 && pagina > 1) {
    paginaAtual = Math.max(1, paginaAtual - 1);
    renderTable(livros, paginaAtual);
    return;
  }

  livrosPaginados.forEach((livro) => {
    const tr = tableBody.insertRow();
    tr.innerHTML = `
      <td data-label="Nome">${livro.name}</td>
      <td data-label="Autor">${livro.author}</td>
      <td data-label="Lançamento">${new Date(
        livro.launchDate
      ).toLocaleDateString()}</td>
      <td data-label="Quantidade">${livro.totalQuantity}</td>
      <td data-label="Editora">${livro.publisherId}</td>
      <td data-label="Ações">
        <button class="action-btn edit-btn" data-id="${
          livro.id
        }"><span class="material-icons-outlined">edit</span></button>
        <button class="action-btn delete-btn" data-id="${
          livro.id
        }"><span class="material-icons-outlined">delete</span></button>
      </td>
    `;
  });

  if (livros.length === 0) {
    mensagemErro.style.display = "block";
    mensagemErro.textContent = "Nenhum livro encontrado.";
    paginacaoContainer.innerHTML = "";
  } else {
    mensagemErro.style.display = "none";
    renderPaginacao(livros);
  }
};

const renderPaginacao = (livros) => {
  const totalPaginas = Math.ceil(livros.length / livrosPorPagina);
  paginacaoContainer.innerHTML = "";

  const btnAnterior = document.createElement("button");
  btnAnterior.innerText = "Anterior";
  btnAnterior.disabled = paginaAtual === 1;
  btnAnterior.classList.add("page-btn");
  btnAnterior.addEventListener("click", () => {
    paginaAtual--;
    renderTable(livros, paginaAtual);
  });
  paginacaoContainer.appendChild(btnAnterior);

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.classList.add("page-btn");
    if (i === paginaAtual) btn.classList.add("active");
    btn.addEventListener("click", () => {
      paginaAtual = i;
      renderTable(livros, paginaAtual);
    });
    paginacaoContainer.appendChild(btn);
  }

  const btnProximo = document.createElement("button");
  btnProximo.innerText = "Próximo";
  btnProximo.disabled = paginaAtual === totalPaginas;
  btnProximo.classList.add("page-btn");
  btnProximo.addEventListener("click", () => {
    paginaAtual++;
    renderTable(livros, paginaAtual);
  });
  paginacaoContainer.appendChild(btnProximo);
};

// --- Funções de Interação com a API (Axios) ---
const fetchBooks = async () => {
  try {
    const token = getToken();
    if (!token) {
      window.location.href = "/";
      return;
    }
    const response = await axios.get(`${API_BASE_URL}/book`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    todosOsLivros = response.data;
    renderTable(todosOsLivros, paginaAtual);
  } catch (error) {
    mensagemErro.style.display = "block";
    mensagemErro.textContent = "Erro ao carregar livros.";
  }
};

const FetchPublishers = async () => {
  const token = getToken();
  if (!token) return;

  const response = await axios.get(`${API_BASE_URL}/publisher`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const cadastrarLivro = async (livroData) => {
  try {
    const token = getToken();
    if (!token) return;
    await axios.post(`${API_BASE_URL}/book`, livroData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    closeModal(modalCadastrar);
    openModal(modalCadastrando);
    setTimeout(() => closeModal(modalCadastrando), 1500);
    await fetchBooks();
    searchInput.value = "";
    paginaAtual = 1;
  } catch (error) {
    alert("Erro ao cadastrar livro.");
  }
};

const atualizarLivro = async (id, livroData) => {
  try {
    const token = getToken();
    if (!token) return;
    await axios.put(`${API_BASE_URL}/book/${id}`, livroData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    closeModal(modalAtualizar);
    openModal(modalAtualizando);
    setTimeout(() => closeModal(modalAtualizando), 1500);
    await fetchBooks();
    searchInput.value = "";
  } catch (error) {
    alert("Erro ao atualizar livro.");
  }
};

const excluirLivro = async (id) => {
  try {
    const token = getToken();
    if (!token) return;
    await axios.delete(`${API_BASE_URL}/book/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    closeModal(modalConfirmando);
    openModal(modalDeletando);
    setTimeout(() => closeModal(modalDeletando), 1500);
    await fetchBooks();
    searchInput.value = "";
  } catch (error) {
    alert("Erro ao excluir livro.");
  }
};

// --- Funções de Modal ---
const openModal = (modal) => {
  modalOverlay.classList.add("is-open");
  modal.classList.add("is-open");
};
const closeModal = (modal) => {
  modal.classList.remove("is-open");
  modalOverlay.classList.remove("is-open");
  idLivroEditando = null;
  idParaExcluir = null;
  formCadastrar.reset();
  formAtualizar.reset();
};

// --- Gerenciamento de Eventos ---
document.addEventListener("DOMContentLoaded", () => {
  fetchBooks();

  searchInput.addEventListener("input", () => {
    const termo = searchInput.value.toLowerCase().trim();
    const filtrados = todosOsLivros.filter(
      (l) =>
        l.name.toLowerCase().includes(termo) ||
        l.author.toLowerCase().includes(termo) ||
        l.launchDate.includes(termo) ||
        String(l.totalQuantity).includes(termo) ||
        String(l.publisherId).includes(termo)
    );
    paginaAtual = 1;
    renderTable(filtrados, paginaAtual);
  });

  addLivroBtn.addEventListener("click", () => openModal(modalCadastrar));
  formCadastrar.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = {
      name: registerNameInput.value.trim(),
      author: registerAuthorInput.value.trim(),
      launchDate: registerLaunchInput.value,
      totalQuantity: parseInt(registerQuantityInput.value, 10),
      publisherId: parseInt(registerPublisherInput.value, 10),
    };
    cadastrarLivro(data);
  });

  formAtualizar.addEventListener("submit", (event) => {
    event.preventDefault();
    if (idLivroEditando === null) return;
    const data = {
      name: updateNameInput.value.trim(),
      author: updateAuthorInput.value.trim(),
      launchDate: updateLaunchInput.value,
      totalQuantity: parseInt(updateQuantityInput.value, 10),
      publisherId: parseInt(updatePublisherInput.value, 10),
    };
    atualizarLivro(idLivroEditando, data);
  });

  tableBody.addEventListener("click", (event) => {
    const editBtn = event.target.closest(".edit-btn");
    const deleteBtn = event.target.closest(".delete-btn");

    if (editBtn) {
      idLivroEditando = parseInt(editBtn.dataset.id, 10);
      const livro = todosOsLivros.find((l) => l.id === idLivroEditando);
      if (livro) {
        updateNameInput.value = livro.name;
        updateAuthorInput.value = livro.author;
        updateLaunchInput.value = livro.launchDate;
        updateQuantityInput.value = livro.totalQuantity;
        updatePublisherInput.value = livro.publisherId;
        openModal(modalAtualizar);
      }
    }

    if (deleteBtn) {
      idParaExcluir = parseInt(deleteBtn.dataset.id, 10);
      openModal(modalConfirmando);
    }
  });

  confirmDeleteBtn.addEventListener("click", () => {
    if (idParaExcluir !== null) excluirLivro(idParaExcluir);
  });

  cancelarBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const m = e.target.closest(".modal");
      closeModal(m);
    })
  );
  fecharBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const m = e.target.closest(".modal");
      closeModal(m);
    })
  );

  toggleNav.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.toggle("active");
  });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("active") && !nav.contains(e.target))
      nav.classList.remove("active");
  });

  profileButton.addEventListener("click", () =>
    profileModal.classList.toggle("visible")
  );
  document.addEventListener("click", (e) => {
    if (!profileButton.contains(e.target) && !profileModal.contains(e.target))
      profileModal.classList.remove("visible");
  });
});
