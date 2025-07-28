document.addEventListener("DOMContentLoaded", () => {
  const editoraList = [
    {
      nome: "Moderna",
      email: "moderna@exemplo.com",
      telefone: "88 888888-8888",
      site: "www.moderna.com.br",
    },
    {
      nome: "Saraiva",
      email: "saraiva@exemplo.com",
      telefone: "88 888888-8888",
      site: "www.saraiva.com.br",
    },
    {
      nome: "Panda Books",
      email: "pandab@exemplo.com",
      telefone: "88 888888-8888",
      site: "www.pandabooks.com.br",
    },
    {
      nome: "Autêntica",
      email: "autentica@exemplo.com",
      telefone: "88 888888-8888",
      site: "www.autentica.com.br",
    },
    {
      nome: "Martin Claret",
      email: "martinc@exemplo.com",
      telefone: "88 888888-8888",
      site: "www.martinclaret.com.br",
    },
    {
      nome: "Record",
      email: "record@exemplo.com",
      telefone: "88 888888-8888",
      site: "www.record.com.br",
    },
  ];

  const editorasPorPagina = 6;
  let paginaAtual = 1;

  const searchInput = document.getElementById("search-input");
  const tableBody = document.querySelector("#users-table tbody");
  const paginacaoContainer = document.getElementById("pagination");

  const renderTable = (editoras, pagina = 1) => {
    tableBody.innerHTML = "";

    const inicio = (pagina - 1) * editorasPorPagina;
    const fim = inicio + editorasPorPagina;
    const editorasPaginadas = editoras.slice(inicio, fim);

    editorasPaginadas.forEach((Editora, i) => {
      let tr = tableBody.insertRow();
      tr.innerHTML = `
        <td data-label="Nome">${Editora.nome}</td>
        <td data-label="Email">${Editora.email}</td>
        <td data-label="Telefone">${Editora.telefone}</td>
        <td data-label="Site">${Editora.site}</td>
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
    if (editoras.length === 0) {
      mensagemErro.style.display = "block";
      paginacaoContainer.innerHTML = "";
    } else {
      mensagemErro.style.display = "none";
      renderPaginacao(editoras);
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

  const filterEditoras = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredEditoras = editoraList.filter((Editora) => {
      return (
        Editora.nome.toLowerCase().includes(searchTerm) ||
        Editora.email.toLowerCase().includes(searchTerm) ||
        Editora.telefone.toLowerCase().includes(searchTerm) ||
        Editora.site.toLocaleLowerCase().includes(searchTerm) ||
        searchTerm === ""
      );
    });

    paginaAtual = 1;
    renderTable(filteredEditoras, paginaAtual);
  };

  searchInput.addEventListener("input", filterEditoras);

  // Modais
  const addEditora = document.getElementById("add-user-btn");
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
  const inputEmail = document.getElementById("update-email");
  const inputtelefone = document.getElementById("update-telefone");
  const inputsite = document.getElementById("update-site");

  let indexUsuarioEditando = null;
  let indexParaExcluir = null;

  addEditora.addEventListener("click", () => {
    modalOverlay.classList.add("is-open");
    modalCadastrar.classList.add("is-open");
  });

  formCadastrar.addEventListener("submit", (event) => {
    if (!formCadastrar.checkValidity()) {
      return;
    }
    event.preventDefault();

    const nomeInput = document.getElementById("register-name");
    const emailInput = document.getElementById("register-email");
    const telefoneInput = document.getElementById("register-telefone");
    const siteInput = document.getElementById("register-site");

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const site = siteInput.value.trim();

    if (nome === "") {
      nomeInput.setCustomValidity("O nome é obrigatório.");
      nomeInput.reportValidity();
      return;
    }
    if (email === "") {
      emailInput.setCustomValidity("O email é obrigatório.");
      emailInput.reportValidity();
      return;
    }
    if (telefone === "") {
      telefoneInput.setCustomValidity("O telefone é obrigatório");
      telefoneInput.reportValidity();
      return;
    }

    const emailExistente = editoraList.some(
      (editora) => editora.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExistente) {
      emailInput.setCustomValidity("Já existe uma editora com este e-mail.");
      emailInput.reportValidity();
      return;
    }

    const nomeExistente = editoraList.some(
      (editora) => editora.nome.toLowerCase() === nome.toLowerCase()
    );

    if (nomeExistente) {
      nomeInput.setCustomValidity("Já existe uma editora com este nome.");
      nomeInput.reportValidity();
      return;
    }

    const novaEditora = {
      nome,
      email,
      telefone,
      site,
    };

    editoraList.push(novaEditora);
    searchInput.value = "";
    paginaAtual = Math.ceil(editoraList.length / editorasPorPagina);
    renderTable(editoraList, paginaAtual);

    modalCadastrar.classList.remove("is-open");
    modalCadastrando.classList.add("is-open");

    formCadastrar.reset();
  });

  tableBody.addEventListener("click", (event) => {
    const editBtn = event.target.closest(".edit-btn");
    const deleteBtn = event.target.closest(".delete-btn");

    if (editBtn) {
      const index = parseInt(editBtn.dataset.index);
      const Editora = editoraList[index];

      inputName.value = Editora.nome;
      inputEmail.value = Editora.email;
      inputtelefone.value = Editora.telefone;
      inputsite.value = Editora.site;

      indexUsuarioEditando = index;

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
    const email = inputEmail.value.trim();
    const telefone = inputtelefone.value.trim();
    const site = inputsite.value.trim();

    editoraList[indexUsuarioEditando].nome = nome;
    editoraList[indexUsuarioEditando].email = email;
    editoraList[indexUsuarioEditando].telefone = telefone;
    editoraList[indexUsuarioEditando].site = site;

    renderTable(editoraList, paginaAtual);
    searchInput.value = "";

    modalAtualizar.classList.remove("is-open");
    modalAtualizando.classList.add("is-open");

    formAtualizar.reset();
    indexUsuarioEditando = null;
  });

  modalConfirmando.addEventListener("click", (event) => {
    const sim = event.target.closest(".btn-primary");
    if (sim && indexParaExcluir !== null) {
      editoraList.splice(indexParaExcluir, 1);
      indexParaExcluir = null;

      paginaAtual = Math.min(
        paginaAtual,
        Math.ceil(editoraList.length / editorasPorPagina)
      );

      renderTable(editoraList, paginaAtual);
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

  const toggleNav = document.getElementById("toggle-nav");
  const nav = document.getElementById("navbar");
  toggleNav.addEventListener("click", (e) => {
    e.stopPropagation(); // impede propagação para o documento
    nav.classList.toggle("active");
  });

  // Fecha navbar ao clicar fora
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("active") && !nav.contains(e.target)) {
      nav.classList.remove("active");
    }
  });

  const profileButton = document.getElementById("profile-button");
  const profileModal = document.getElementById("profile-modal");

  profileButton.addEventListener("click", () => {
    profileModal.classList.toggle("visible");
  });

  document.addEventListener("click", (e) => {
    if (!profileButton.contains(e.target) && !profileModal.contains(e.target)) {
      profileModal.classList.remove("visible");
    }
  });

  renderTable(editoraList, paginaAtual);
});
