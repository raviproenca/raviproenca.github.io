document.addEventListener("DOMContentLoaded", () => {
  const livroList = [
    {
      nome: "Xal, sua autobiografia",
      autor: "Xal",
      editora: "Panda Books",
      lancamento: "11/07/2025",
      estoque: 115,
    },
    {
      nome: "O Garoto da Novela",
      autor: "Walcyr Carrasco",
      editora: "Moderna",
      lancamento: "11/07/2025",
      estoque: 67,
    },
    {
      nome: "Meu Lugar no Mundo",
      autor: "Walcyr Carrasco",
      editora: "Moderna",
      lancamento: "11/07/2025",
      estoque: 83,
    },
    {
      nome: "Hoje está um dia melhor",
      autor: "André de Leones",
      editora: "Record",
      lancamento: "11/07/2025",
      estoque: 29,
    },
    {
      nome: "O Milagre da Manhã",
      autor: "Hal Elrod",
      editora: "Saraiva",
      lancamento: "11/07/2025",
      estoque: 104,
    },
    {
      nome: "O frágil toque dos monstros",
      autor: "Alex Sens",
      editora: "Saraiva",
      lancamento: "11/07/2025",
      estoque: 55,
    },
  ];

  const livrosPorPagina = 6;
  let paginaAtual = 1;

  const searchInput = document.getElementById("search-input");
  const tableBody = document.querySelector("#users-table tbody");
  const paginacaoContainer = document.getElementById("pagination");

  const renderTable = (livros, pagina = 1) => {
    tableBody.innerHTML = "";

    const inicio = (pagina - 1) * livrosPorPagina;
    const fim = inicio + livrosPorPagina;
    const livrosPaginados = livros.slice(inicio, fim);

    livrosPaginados.forEach((livro, i) => {
      let tr = tableBody.insertRow();
      tr.innerHTML = `
        <td data-label="Nome">${livro.nome}</td>
        <td data-label="Autor">${livro.autor}</td>
        <td data-label="Editora">${livro.editora}</td>
        <td data-label="Lançamento">${livro.lancamento}</td>
        <td data-label="Estoque" class="${
          livro.estoque < 30 ? "text-danger" : ""
        }">${livro.estoque}</td>
        <td data-label="Ações">
          <button class="action-btn edit-btn" data-index="${inicio + i}">
            <span class="material-icons-outlined">edit</span>
          </button>
          <button class="action-btn delete-btn" data-index="${inicio + i}">
            <span class="material-icons-outlined">delete</span>
          </button>
        </td>
      `;
    });

    const mensagemErro = document.getElementById("mensagem-erro");
    if (livros.length === 0) {
      mensagemErro.style.display = "block";
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

  const filterLivros = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredLivros = livroList.filter((livro) => {
      return (
        livro.nome.toLowerCase().includes(searchTerm) ||
        livro.autor.toLowerCase().includes(searchTerm) ||
        livro.editora.toLowerCase().includes(searchTerm) ||
        livro.lancamento.toLowerCase().includes(searchTerm) ||
        String(livro.estoque).includes(searchTerm) ||
        searchTerm === ""
      );
    });

    paginaAtual = 1;
    renderTable(filteredLivros, paginaAtual);
  };

  searchInput.addEventListener("input", filterLivros);

  // Modais
  const addLivro = document.getElementById("add-user-btn"); // Reusing this ID as per the pattern
  const cancelar = document.querySelectorAll(".btn-secondary");
  const fechar = document.querySelectorAll(".close-modal-btn");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalCadastrar = document.getElementById("modal-cadastrar");
  const modalAtualizar = document.getElementById("modal-atualizar");
  const modalCadastrando = document.getElementById("modal-cadastrando");
  const modalAtualizando = document.getElementById("modal-atualizando");
  const modalConfirmando = document.getElementById("modal-confirmando");
  const modalDeletando = document.getElementById("modal-deletando");
  const formCadastrar = document.getElementById("form-cadastrar");
  const formAtualizar = document.getElementById("form-atualizar");
  const inputName = document.getElementById("update-name");
  const inputAutor = document.getElementById("update-autor");
  const inputEditora = document.getElementById("update-editora");
  const inputLancamento = document.getElementById("update-lancamento");
  const inputEstoque = document.getElementById("update-estoque");

  let indexLivroEditando = null;
  let indexParaExcluir = null;

  addLivro.addEventListener("click", () => {
    modalOverlay.classList.add("is-open");
    modalCadastrar.classList.add("is-open");
  });

  formCadastrar.addEventListener("submit", (event) => {
    if (!formCadastrar.checkValidity()) return;
    event.preventDefault();

    const nomeInput = document.getElementById("register-name");
    const autorInput = document.getElementById("register-autor");
    const editoraInput = document.getElementById("register-editora");
    const lancamentoInput = document.getElementById("register-lancamento");
    const estoqueInput = document.getElementById("register-estoque");

    const nome = nomeInput.value.trim();
    const autor = autorInput.value.trim();
    const editora = editoraInput.value.trim();
    const lancamento = lancamentoInput.value.trim();
    const estoque = parseInt(estoqueInput.value.trim(), 10);

    if (nome === "") {
      nomeInput.setCustomValidity("O nome é obrigatório.");
      nomeInput.reportValidity();
      return;
    }

    if (autor === "") {
      autorInput.setCustomValidity("O autor é obrigatório.");
      autorInput.reportValidity();
      return;
    }

    if (editora === "") {
      editoraInput.setCustomValidity("A editora é obrigatória.");
      editoraInput.reportValidity();
      return;
    }

    if (lancamento === "") {
      lancamentoInput.setCustomValidity("A data de lançamento é obrigatória.");
      lancamentoInput.reportValidity();
      return;
    }

    if (isNaN(estoque) || estoque < 0) {
      estoqueInput.setCustomValidity("O estoque deve ser um número positivo.");
      estoqueInput.reportValidity();
      return;
    }

    const nomeExistente = livroList.some(
      (livro) => livro.nome.toLowerCase() === nome.toLowerCase()
    );

    if (nomeExistente) {
      nomeInput.setCustomValidity("Já existe um livro com este nome.");
      nomeInput.reportValidity();
      return;
    }

    const novoLivro = {
      nome,
      autor,
      editora,
      lancamento,
      estoque,
    };

    livroList.push(novoLivro);
    searchInput.value = "";
    paginaAtual = Math.ceil(livroList.length / livrosPorPagina);
    renderTable(livroList, paginaAtual);

    modalCadastrar.classList.remove("is-open");
    modalCadastrando.classList.add("is-open");

    formCadastrar.reset();
  });

  tableBody.addEventListener("click", (event) => {
    const editBtn = event.target.closest(".edit-btn");
    const deleteBtn = event.target.closest(".delete-btn");

    const formatarDataParaInput = (dataBr) => {
      const [dia, mes, ano] = dataBr.split("/");
      return `${ano}-${mes}-${dia}`;
    };

    if (editBtn) {
      const index = parseInt(editBtn.dataset.index);
      const livro = livroList[index];

      inputName.value = livro.nome;
      inputAutor.value = livro.autor;
      inputEditora.value = livro.editora;
      inputLancamento.value = formatarDataParaInput(livro.lancamento);
      inputEstoque.value = livro.estoque;

      indexLivroEditando = index;

      modalOverlay.classList.add("is-open");
      modalAtualizar.classList.add("is-open");
    }

    if (deleteBtn) {
      const index = parseInt(deleteBtn.dataset.index);
      indexParaExcluir = index;

      modalOverlay.classList.add("is-open");
      modalConfirmando.classList.add("is-open");
    }
  });

  formAtualizar.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = inputName.value.trim();
    const autor = inputAutor.value.trim();
    const editora = inputEditora.value.trim();
    const lancamento = inputLancamento.value.trim();
    const estoque = parseInt(inputEstoque.value.trim(), 10);

    livroList[indexLivroEditando].nome = nome;
    livroList[indexLivroEditando].autor = autor;
    livroList[indexLivroEditando].editora = editora;
    livroList[indexLivroEditando].lancamento = lancamento;
    livroList[indexLivroEditando].estoque = estoque;

    renderTable(livroList, paginaAtual);
    searchInput.value = "";

    modalAtualizar.classList.remove("is-open");
    modalAtualizando.classList.add("is-open");

    formAtualizar.reset();
    indexLivroEditando = null;
  });

  modalConfirmando.addEventListener("click", (event) => {
    const sim = event.target.closest(".btn-primary");
    if (sim && indexParaExcluir !== null) {
      livroList.splice(indexParaExcluir, 1);
      indexParaExcluir = null;

      paginaAtual = Math.min(
        paginaAtual,
        Math.ceil(livroList.length / livrosPorPagina)
      );

      renderTable(livroList, paginaAtual);
      modalConfirmando.classList.remove("is-open");
      modalDeletando.classList.add("is-open");
    }
  });

  cancelar.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const modal = event.target.closest(".modal");
      modal.classList.remove("is-open");
      modalOverlay.classList.remove("is-open");
      indexParaExcluir = null;
    });
  });

  fechar.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const modal = event.target.closest(".modal");
      modal.classList.remove("is-open");
      modalOverlay.classList.remove("is-open");
      indexParaExcluir = null;
    });
  });

  renderTable(livroList, paginaAtual);
});
