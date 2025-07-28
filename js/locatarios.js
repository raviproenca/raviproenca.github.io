document.addEventListener("DOMContentLoaded", () => {
  const locatarioList = [
    {
      nome: "Ricardo Sobral",
      email: "ricardo@exemplo.com",
      celular: "88 88888-8888",
      endereco: "Rua A",
      cpf: "111.111.111-11",
    },
    {
      nome: "José Artur",
      email: "jose@exemplo.com",
      celular: "88 88888-8888",
      endereco: "Bairro B",
      cpf: "111.111.111-11",
    },
    {
      nome: "Luana Ferreira",
      email: "luana@exemplo.com",
      celular: "88 88888-8888",
      endereco: "Avenida C",
      cpf: "111.111.111-11",
    },
    {
      nome: "Clarissa Lima",
      email: "clarissa@exemplo.com",
      celular: "88 88888-8888",
      endereco: "Esquina D",
      cpf: "111.111.111-11",
    },
    {
      nome: "Sarah Paes",
      email: "sarah@exemplo.com",
      celular: "88 88888-8888",
      endereco: "Perto do E",
      cpf: "111.111.111-11",
    },
    {
      nome: "Felipe Mota",
      email: "felipe@exemplo.com",
      celular: "88 88888-8888",
      endereco: "Casa F",
      cpf: "111.111.111-11",
    },
  ];

  const locatariosPorPagina = 6;
  let paginaAtual = 1;

  const searchInput = document.getElementById("search-input");
  const tableBody = document.querySelector("#users-table tbody"); // This ID is reused from the other scripts
  const paginacaoContainer = document.getElementById("pagination");

  const renderTable = (locatarios, pagina = 1) => {
    tableBody.innerHTML = "";

    const inicio = (pagina - 1) * locatariosPorPagina;
    const fim = inicio + locatariosPorPagina;
    const locatariosPaginados = locatarios.slice(inicio, fim);

    locatariosPaginados.forEach((locatario, i) => {
      let tr = tableBody.insertRow();
      tr.innerHTML = `
        <td data-label="Nome">${locatario.nome}</td>
        <td data-label="Email">${locatario.email}</td>
        <td data-label="Celular">${locatario.celular}</td>
        <td data-label="Endereço">${locatario.endereco}</td>
        <td data-label="CPF">${locatario.cpf}</td>
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
    if (locatarios.length === 0) {
      mensagemErro.style.display = "block";
      paginacaoContainer.innerHTML = "";
    } else {
      mensagemErro.style.display = "none";
      renderPaginacao(locatarios);
    }
  };

  const renderPaginacao = (locatarios) => {
    const totalPaginas = Math.ceil(locatarios.length / locatariosPorPagina);
    paginacaoContainer.innerHTML = "";

    const btnAnterior = document.createElement("button");
    btnAnterior.innerText = "Anterior";
    btnAnterior.disabled = paginaAtual === 1;
    btnAnterior.classList.add("page-btn");
    btnAnterior.addEventListener("click", () => {
      paginaAtual--;
      renderTable(locatarios, paginaAtual);
    });
    paginacaoContainer.appendChild(btnAnterior);

    for (let i = 1; i <= totalPaginas; i++) {
      const btn = document.createElement("button");
      btn.innerText = i;
      btn.classList.add("page-btn");
      if (i === paginaAtual) btn.classList.add("active");
      btn.addEventListener("click", () => {
        paginaAtual = i;
        renderTable(locatarios, paginaAtual);
      });
      paginacaoContainer.appendChild(btn);
    }

    const btnProximo = document.createElement("button");
    btnProximo.innerText = "Próximo";
    btnProximo.disabled = paginaAtual === totalPaginas;
    btnProximo.classList.add("page-btn");
    btnProximo.addEventListener("click", () => {
      paginaAtual++;
      renderTable(locatarios, paginaAtual);
    });
    paginacaoContainer.appendChild(btnProximo);
  };

  const filterLocatarios = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredLocatarios = locatarioList.filter((locatario) => {
      return (
        locatario.nome.toLowerCase().includes(searchTerm) ||
        locatario.email.toLowerCase().includes(searchTerm) ||
        locatario.celular.toLowerCase().includes(searchTerm) ||
        locatario.endereco.toLowerCase().includes(searchTerm) ||
        locatario.cpf.toLowerCase().includes(searchTerm) ||
        searchTerm === ""
      );
    });

    paginaAtual = 1;
    renderTable(filteredLocatarios, paginaAtual);
  };

  searchInput.addEventListener("input", filterLocatarios);

  // Modais
  const addLocatario = document.getElementById("add-user-btn"); // Reusing this ID as per the pattern
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
  const inputCelular = document.getElementById("update-celular");
  const inputEndereco = document.getElementById("update-endereco");
  const inputCpf = document.getElementById("update-cpf");

  let indexLocatarioEditando = null;
  let indexParaExcluir = null;

  addLocatario.addEventListener("click", () => {
    modalOverlay.classList.add("is-open");
    modalCadastrar.classList.add("is-open");
  });

  formCadastrar.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!formCadastrar.checkValidity()) return;

    const nomeInput = document.getElementById("register-name");
    const emailInput = document.getElementById("register-email");
    const celularInput = document.getElementById("register-celular");
    const enderecoInput = document.getElementById("register-endereco");
    const cpfInput = document.getElementById("register-cpf");

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const celular = celularInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const cpf = cpfInput.value.trim();

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

    if (celular === "") {
      celularInput.setCustomValidity("O celular é obrigatório.");
      celularInput.reportValidity();
      return;
    }

    if (endereco === "") {
      enderecoInput.setCustomValidity("O endereço é obrigatório.");
      enderecoInput.reportValidity();
      return;
    }

    if (cpf === "") {
      cpfInput.setCustomValidity("O CPF é obrigatório.");
      cpfInput.reportValidity();
      return;
    }

    const emailExistente = locatarioList.some(
      (locatario) => locatario.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExistente) {
      emailInput.setCustomValidity("Já existe um locatário com este e-mail.");
      emailInput.reportValidity();
      return;
    }

    const novoLocatario = {
      nome,
      email,
      celular,
      endereco,
      cpf,
    };

    locatarioList.push(novoLocatario);
    searchInput.value = "";
    paginaAtual = Math.ceil(locatarioList.length / locatariosPorPagina);
    renderTable(locatarioList, paginaAtual);

    modalCadastrar.classList.remove("is-open");
    modalCadastrando.classList.add("is-open");

    formCadastrar.reset();
  });

  tableBody.addEventListener("click", (event) => {
    const editBtn = event.target.closest(".edit-btn");
    const deleteBtn = event.target.closest(".delete-btn");

    if (editBtn) {
      const index = parseInt(editBtn.dataset.index);
      const locatario = locatarioList[index];

      inputName.value = locatario.nome;
      inputEmail.value = locatario.email;
      inputCelular.value = locatario.celular;
      inputEndereco.value = locatario.endereco;
      inputCpf.value = locatario.cpf;

      indexLocatarioEditando = index;

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
    const celular = inputCelular.value.trim();
    const endereco = inputEndereco.value.trim();
    const cpf = inputCpf.value.trim();

    locatarioList[indexLocatarioEditando].nome = nome;
    locatarioList[indexLocatarioEditando].email = email;
    locatarioList[indexLocatarioEditando].celular = celular;
    locatarioList[indexLocatarioEditando].endereco = endereco;
    locatarioList[indexLocatarioEditando].cpf = cpf;

    renderTable(locatarioList, paginaAtual);
    searchInput.value = "";

    modalAtualizar.classList.remove("is-open");
    modalAtualizando.classList.add("is-open");

    formAtualizar.reset();
    indexLocatarioEditando = null;
  });

  modalConfirmando.addEventListener("click", (event) => {
    const sim = event.target.closest(".btn-primary");
    if (sim && indexParaExcluir !== null) {
      locatarioList.splice(indexParaExcluir, 1);
      indexParaExcluir = null;

      paginaAtual = Math.min(
        paginaAtual,
        Math.ceil(locatarioList.length / locatariosPorPagina)
      );

      renderTable(locatarioList, paginaAtual);
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

  renderTable(locatarioList, paginaAtual);
});
