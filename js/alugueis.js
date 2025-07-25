document.addEventListener("DOMContentLoaded", () => {
  const aluguelList = [
    {
      livro: "Capitães Areia",
      locatario: "Luana Ferreira",
      dataLocacao: "11/07/2025",
      dataDevolucao: "15/07/2025",
    },
    {
      livro: "Laranja Mecânica",
      locatario: "Sarah Paes",
      dataLocacao: "11/07/2025",
      dataDevolucao: "15/07/2025",
    },
    {
      livro: "Pequeno Príncipe",
      locatario: "Clarissa Lima",
      dataLocacao: "11/07/2025",
      dataDevolucao: "15/07/2025",
    },
    {
      livro: "Dom Casmurro",
      locatario: "Felipe Mota",
      dataLocacao: "11/07/2025",
      dataDevolucao: "15/07/2025",
    },
    {
      livro: "Grande Sertão",
      locatario: "Ricardo Sobral",
      dataLocacao: "11/07/2025",
      dataDevolucao: "15/07/2025",
    },
    {
      livro: "Sapiens",
      locatario: "José Artur",
      dataLocacao: "11/07/2025",
      dataDevolucao: "15/07/2025",
    },
  ];

  const alugueisPorPagina = 6;
  let paginaAtual = 1;

  const searchInput = document.getElementById("search-input");
  const tableBody = document.querySelector("#users-table tbody"); // ID reutilizado do HTML
  const paginacaoContainer = document.getElementById("pagination");

  const renderTable = (alugueis, pagina = 1) => {
    tableBody.innerHTML = "";

    const inicio = (pagina - 1) * alugueisPorPagina;
    const fim = inicio + alugueisPorPagina;
    const alugueisPaginados = alugueis.slice(inicio, fim);

    alugueisPaginados.forEach((aluguel, i) => {
      let tr = tableBody.insertRow();
      tr.innerHTML = `
        <td data-label="Livro">${aluguel.livro}</td>
        <td data-label="Locatário">${aluguel.locatario}</td>
        <td data-label="Data de Locação">${aluguel.dataLocacao}</td>
        <td data-label="Data de Devolução">${aluguel.dataDevolucao}</td>
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
    if (alugueis.length === 0) {
      mensagemErro.style.display = "block";
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

  const filterAlugueis = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredAlugueis = aluguelList.filter((aluguel) => {
      return (
        aluguel.livro.toLowerCase().includes(searchTerm) ||
        aluguel.locatario.toLowerCase().includes(searchTerm) ||
        aluguel.dataLocacao.toLowerCase().includes(searchTerm) ||
        aluguel.dataDevolucao.toLowerCase().includes(searchTerm) ||
        searchTerm === ""
      );
    });

    paginaAtual = 1;
    renderTable(filteredAlugueis, paginaAtual);
  };

  searchInput.addEventListener("input", filterAlugueis);

  // Modais
  const addAluguel = document.getElementById("add-user-btn"); // ID reutilizado do HTML
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
  const inputLivro = document.getElementById("update-livro");
  const inputLocatario = document.getElementById("update-locatario");
  const inputDataLocacao = document.getElementById("update-data-locacao");
  const inputDataDevolucao = document.getElementById("update-data-devolucao");

  let indexAluguelEditando = null;
  let indexParaExcluir = null;

  addAluguel.addEventListener("click", () => {
    modalOverlay.classList.add("is-open");
    modalCadastrar.classList.add("is-open");
  });

  formCadastrar.addEventListener("submit", (event) => {
    if (!formCadastrar.checkValidity()) return;
    event.preventDefault();

    const livroInput = document.getElementById("register-livro");
    const locatarioInput = document.getElementById("register-locatario");
    const dataLocacaoInput = document.getElementById("register-data-locacao");
    const dataDevolucaoInput = document.getElementById(
      "register-data-devolucao"
    );

    const livro = livroInput.value.trim();
    const locatario = locatarioInput.value.trim();
    const dataLocacao = dataLocacaoInput.value.trim();
    const dataDevolucao = dataDevolucaoInput.value.trim();

    if (livro === "") {
      livroInput.setCustomValidity("O livro é obrigatório.");
      livroInput.reportValidity();
      return;
    }

    if (locatario === "") {
      locatarioInput.setCustomValidity("O locatário é obrigatório.");
      locatarioInput.reportValidity();
      return;
    }

    if (dataLocacao === "") {
      dataLocacaoInput.setCustomValidity("A data de locação é obrigatória.");
      dataLocacaoInput.reportValidity();
      return;
    }

    if (dataDevolucao === "") {
      dataDevolucaoInput.setCustomValidity(
        "A data de devolução é obrigatória."
      );
      dataDevolucaoInput.reportValidity();
      return;
    }

    const novoAluguel = {
      livro,
      locatario,
      dataLocacao,
      dataDevolucao,
    };

    aluguelList.push(novoAluguel);
    searchInput.value = "";
    paginaAtual = Math.ceil(aluguelList.length / alugueisPorPagina);
    renderTable(aluguelList, paginaAtual);

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
      const aluguel = aluguelList[index];

      inputLivro.value = aluguel.livro;
      inputLocatario.value = aluguel.locatario;
      inputDataLocacao.value = formatarDataParaInput(aluguel.dataLocacao);
      inputDataDevolucao.value = formatarDataParaInput(aluguel.dataDevolucao);

      indexAluguelEditando = index;

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

    const livro = inputLivro.value.trim();
    const locatario = inputLocatario.value.trim();
    const dataLocacao = inputDataLocacao.value.trim();
    const dataDevolucao = inputDataDevolucao.value.trim();

    aluguelList[indexAluguelEditando].livro = livro;
    aluguelList[indexAluguelEditando].locatario = locatario;
    aluguelList[indexAluguelEditando].dataLocacao = dataLocacao;
    aluguelList[indexAluguelEditando].dataDevolucao = dataDevolucao;

    renderTable(aluguelList, paginaAtual);
    searchInput.value = "";

    modalAtualizar.classList.remove("is-open");
    modalAtualizando.classList.add("is-open");

    formAtualizar.reset();
    indexAluguelEditando = null;
  });

  modalConfirmando.addEventListener("click", (event) => {
    const sim = event.target.closest(".btn-primary");
    if (sim && indexParaExcluir !== null) {
      aluguelList.splice(indexParaExcluir, 1);
      indexParaExcluir = null;

      paginaAtual = Math.min(
        paginaAtual,
        Math.ceil(aluguelList.length / alugueisPorPagina)
      );

      renderTable(aluguelList, paginaAtual);
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

  renderTable(aluguelList, paginaAtual);
});
