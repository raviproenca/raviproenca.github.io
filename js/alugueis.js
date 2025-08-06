import {
  fetchRents,
  cadastrarAluguel,
  atualizarAluguel,
  finalizarAluguel,
} from "/services/alugueisService.js";

import { fetchBooks } from "/services/livrosService.js";
import { fetchRenters } from "/services/locatariosService.js";

// --- Variáveis Globais ---
const alugueisPorPagina = 6;
let paginaAtual = 1;
let todosOsAlugueis = [];
let idAluguelEditando = null;
let idParaExcluir = null;
let livrosDisponiveis = [];
let locatariosDisponiveis = [];

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
const registerLivroInput = document.getElementById("register-livro");
const registerLocatarioInput = document.getElementById("register-locatario");
const registerDataLocacaoInput = document.getElementById(
  "register-data-locacao"
);
const registerDataDevolucaoInput = document.getElementById(
  "register-data-devolucao"
);
const updateLivroInput = document.getElementById("update-livro");
const updateLocatarioInput = document.getElementById("update-locatario");
const updateDataLocacaoInput = document.getElementById("update-data-locacao");
const updateDataDevolucaoInput = document.getElementById(
  "update-data-devolucao"
);
const addAluguelBtn = document.getElementById("add-user-btn");
const cancelarBtns = document.querySelectorAll(".btn-secondary");
const fecharBtns = document.querySelectorAll(".close-modal-btn");
const confirmDeleteBtn = modalConfirmando.querySelector(".btn-primary");

// --- Funções de Renderização ---
const renderTable = (alugueis, pagina = 1) => {
  tableBody.innerHTML = "";

  const inicio = (pagina - 1) * alugueisPorPagina;
  const fim = inicio + alugueisPorPagina;
  const alugueisPaginados = alugueis.slice(inicio, fim);

  alugueisPaginados.forEach((aluguel, i) => {
    const livro = livrosDisponiveis.find((e) => e.id === aluguel.livro.id);
    const locatario = locatariosDisponiveis.find(
      (e) => e.id === aluguel.locatario.id
    );

    const tr = tableBody.insertRow();
    tr.innerHTML = `
      <td data-label="Livro">${livro.name}</td>
      <td data-label="Locatário">${locatario.name}</td>
      <td data-label="Data de Locação">${new Date(
        aluguel.dataLocacao
      ).toLocaleDateString()}</td>
      <td data-label="Data de Devolução">${new Date(
        aluguel.dataDevolucao
      ).toLocaleDateString()}</td>
      <td data-label="Ações">
        <button class="action-btn returned-btn" data-id="${aluguel.id}">
          <span class="material-icons-outlined">check_box</span>
        </button>
        <button class="action-btn delete-btn" data-id="${aluguel.id}">
          <span class="material-icons-outlined">delete</span>
        </button>
      </td>
    `;
  });

  if (alugueis.length === 0) {
    mensagemErro.style.display = "block";
    mensagemErro.textContent = "Nenhum aluguel encontrado.";
    paginacaoContainer.innerHTML = "";
  } else {
    mensagemErro.style.display = "none";
    renderPaginacao(alugueis);
  }
};

const renderPaginacao = (alugueis) => {
  const totalPaginas = Math.ceil(alugueis.length / alugueisPorPagina);
  paginacaoContainer.innerHTML = "";

  const btnAnterior = document.createElement("button");
  btnAnterior.innerText = "Anterior";
  btnAnterior.disabled = paginaAtual === 1;
  btnAnterior.classList.add("page-btn");
  btnAnterior.addEventListener("click", () => {
    paginaAtual--;
    renderTable(alugueis, paginaAtual);
  });
  paginacaoContainer.appendChild(btnAnterior);

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.classList.add("page-btn");
    if (i === paginaAtual) btn.classList.add("active");
    btn.addEventListener("click", () => {
      paginaAtual = i;
      renderTable(alugueis, paginaAtual);
    });
    paginacaoContainer.appendChild(btn);
  }

  const btnProximo = document.createElement("button");
  btnProximo.innerText = "Próximo";
  btnProximo.disabled = paginaAtual === totalPaginas;
  btnProximo.classList.add("page-btn");
  btnProximo.addEventListener("click", () => {
    paginaAtual++;
    renderTable(alugueis, paginaAtual);
  });
  paginacaoContainer.appendChild(btnProximo);
};

const renderLivrosNoSelect = (selectElement) => {
  selectElement.innerHTML = `<option value="">Selecione uma Livro</option>`;
  livrosDisponiveis.forEach((livro) => {
    const option = document.createElement("option");
    option.value = livro.id;
    option.textContent = livro.name;
    selectElement.appendChild(option);
  });
};

const renderLocatariosNoSelect = (selectElement) => {
  selectElement.innerHTML = `<option value="">Selecione um Locatário</option>`;
  locatariosDisponiveis.forEach((locatario) => {
    const option = document.createElement("option");
    option.value = locatario.id;
    option.textContent = locatario.name;
    selectElement.appendChild(option);
  });
};

// --- Funções de Carregamento ---
const carregarAlugueis = async () => {
  try {
    todosOsAlugueis = await fetchRents();
    renderTable(todosOsAlugueis, paginaAtual);
  } catch (error) {
    console.error("Erro ao carregar aluguéis:", error);
    mensagemErro.style.display = "block";
    mensagemErro.textContent = "Erro ao carregar aluguéis.";
  }
};

const carregarLivros = async () => {
  try {
    livrosDisponiveis = await fetchBooks();
    renderLivrosNoSelect(registerLivroInput);
    renderLivrosNoSelect(updateLivroInput);
  } catch (error) {
    console.error("Erro ao carregar livros:", error);
  }
};

const carregarLocatarios = async () => {
  try {
    livrosDisponiveis = await fetchRenters();
    renderLocatariosNoSelect(registerLocatarioInput);
    renderLocatariosNoSelect(updateLocatarioInput);
  } catch (error) {
    console.error("Erro ao carregar locatários:", error);
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
  idAluguelEditando = null;
  idParaExcluir = null;
  formCadastrar.reset();
  formAtualizar.reset();
};

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", async () => {
  await carregarLivros();
  await carregarLocatarios();
  await carregarAlugueis();

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filteredAlugueis = todosOsAlugueis.filter((aluguel) => {
      return (
        aluguel.livro.toLowerCase().includes(searchTerm) ||
        aluguel.locatario.toLowerCase().includes(searchTerm) ||
        aluguel.dataLocacao.toLowerCase().includes(searchTerm) ||
        aluguel.dataDevolucao.toLowerCase().includes(searchTerm)
      );
    });
    paginaAtual = 1;
    renderTable(filteredAlugueis, paginaAtual);
  });

  addAluguelBtn.addEventListener("click", () => openModal(modalCadastrar));

  cancelarBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => closeModal(e.target.closest(".modal")))
  );

  fecharBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => closeModal(e.target.closest(".modal")))
  );

  formCadastrar.addEventListener("submit", async (event) => {
    event.preventDefault();

    const livro = registerLivroInput.value.trim();
    const locatario = registerLocatarioInput.value.trim();
    const dataLocacao = registerDataLocacaoInput.value.trim();
    const dataDevolucao = registerDataDevolucaoInput.value.trim();

    if (!livro || !locatario || !dataLocacao || !dataDevolucao) return;

    const novoAluguel = { livro, locatario, dataLocacao, dataDevolucao };

    try {
      await cadastrarAluguel(novoAluguel);
      closeModal(modalCadastrar);
      openModal(modalCadastrando);
      setTimeout(() => closeModal(modalCadastrando), 1500);
      await carregarAlugueis();
      searchInput.value = "";
      paginaAtual = Math.ceil(todosOsAlugueis.length / alugueisPorPagina);
    } catch (error) {
      console.error("Erro ao cadastrar aluguel:", error);
      alert(error.message);
    }
  });

  formAtualizar.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (idAluguelEditando === null) return;

    const livro = updateLivroInput.value.trim();
    const locatario = updateLocatarioInput.value.trim();
    const dataLocacao = updateDataLocacaoInput.value.trim();
    const dataDevolucao = updateDataDevolucaoInput.value.trim();

    if (!livro || !locatario || !dataLocacao || !dataDevolucao) return;

    const aluguelAtualizado = { livro, locatario, dataLocacao, dataDevolucao };

    try {
      await atualizarAluguel(idAluguelEditando, aluguelAtualizado);
      closeModal(modalAtualizar);
      openModal(modalAtualizando);
      setTimeout(() => closeModal(modalAtualizando), 1500);
      await carregarAlugueis();
      searchInput.value = "";
    } catch (error) {
      console.error("Erro ao atualizar aluguel:", error);
      alert(error.message);
    }
  });

  tableBody.addEventListener("click", (event) => {
    const returnedBtn = event.target.closest(".returned-btn");
    const deleteBtn = event.target.closest(".delete-btn");

    if (returnedBtn) {
      returnedBtn.classList.toggle("active");
    }

    if (deleteBtn) {
      idParaExcluir = parseInt(deleteBtn.dataset.index, 10);
      openModal(modalConfirmando);
    }
  });

  confirmDeleteBtn.addEventListener("click", async () => {
    if (idParaExcluir !== null) {
      try {
        await finalizarAluguel(idParaExcluir);
        closeModal(modalConfirmando);
        openModal(modalDeletando);
        setTimeout(() => closeModal(modalDeletando), 1500);
        await carregarAlugueis();
        searchInput.value = "";
      } catch (error) {
        console.error("Erro ao excluir aluguel:", error);
        alert(error.message);
      }
    }
  });
});
