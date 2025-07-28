document.addEventListener("DOMContentLoaded", () => {
  const userList = [
    {
      nome: "Jorge Amilcar",
      email: "jorge@exemplo.com",
      nivel: "Usuário Editor",
    },
    {
      nome: "Carlos Ribeiro",
      email: "carlos@exemplo.com",
      nivel: "Usuário Editor",
    },
    {
      nome: "Pedro Santana",
      email: "pedro@exemplo.com",
      nivel: "Usuário Editor",
    },
    {
      nome: "Fábio Oliveira",
      email: "fabio@exemplo.com",
      senha: "********",
      nivel: "Usuário Editor",
    },
    {
      nome: "Sinval Teixeira",
      email: "sinval@exemplo.com",
      senha: "********",
      nivel: "Usuário Editor",
    },
    {
      nome: "Roberto Costa",
      email: "roberto@exemplo.com",
      senha: "********",
      nivel: "Usuário Editor",
    },
  ];

  const usuariosPorPagina = 6;
  let paginaAtual = 1;

  const searchInput = document.getElementById("search-input");
  const tableBody = document.querySelector("#users-table tbody");
  const paginacaoContainer = document.getElementById("pagination");

  const renderTable = (usuarios, pagina = 1) => {
    tableBody.innerHTML = "";

    const inicio = (pagina - 1) * usuariosPorPagina;
    const fim = inicio + usuariosPorPagina;
    const usuariosPaginados = usuarios.slice(inicio, fim);

    usuariosPaginados.forEach((user, i) => {
      let tr = tableBody.insertRow();
      tr.innerHTML = `
        <td data-label="Nome">${user.nome}</td>
        <td data-label="Email">${user.email}</td>
        <td data-label="Senha">********</td>
        <td data-label="Permissão">${user.nivel}</td>
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
    if (usuarios.length === 0) {
      mensagemErro.style.display = "block";
      paginacaoContainer.innerHTML = "";
    } else {
      mensagemErro.style.display = "none";
      renderPaginacao(usuarios);
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

  const filterUsers = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredUsers = userList.filter((user) => {
      return (
        user.nome.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.nivel.toLowerCase().includes(searchTerm) ||
        searchTerm === ""
      );
    });

    paginaAtual = 1; // Resetar página
    renderTable(filteredUsers, paginaAtual);
  };

  searchInput.addEventListener("input", filterUsers);

  // Modais
  const addUser = document.getElementById("add-user-btn");
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
  const inputPassword = document.getElementById("update-password");
  const inputPermission = document.getElementById("update-permission");

  let indexUsuarioEditando = null;
  let indexParaExcluir = null;

  addUser.addEventListener("click", () => {
    modalOverlay.classList.add("is-open");
    modalCadastrar.classList.add("is-open");
  });

  formCadastrar.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!formCadastrar.checkValidity()) return;

    const nomeInput = document.getElementById("register-name");
    const emailInput = document.getElementById("register-email");
    const senhaInput = document.getElementById("register-password");
    const permissaoInput = document.getElementById("register-permission");

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();
    const permissao = permissaoInput.value;

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

    if (senha === "") {
      senhaInput.setCustomValidity("A senha é obrigatória.");
      senhaInput.reportValidity();
      return;
    }

    const emailExistente = userList.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExistente) {
      emailInput.setCustomValidity("Já existe um usuário com este e-mail.");
      emailInput.reportValidity();
      return;
    }

    const novoUsuario = {
      nome,
      email,
      senha,
      nivel: permissao === "editor" ? "Usuário Editor" : "Usuário Leitor",
    };

    userList.push(novoUsuario);
    searchInput.value = "";
    paginaAtual = Math.ceil(userList.length / usuariosPorPagina);
    renderTable(userList, paginaAtual);

    modalCadastrar.classList.remove("is-open");
    modalCadastrando.classList.add("is-open");

    formCadastrar.reset();
  });

  tableBody.addEventListener("click", (event) => {
    const editBtn = event.target.closest(".edit-btn");
    const deleteBtn = event.target.closest(".delete-btn");

    if (editBtn) {
      const index = parseInt(editBtn.dataset.index);
      const user = userList[index];

      inputName.value = user.nome;
      inputEmail.value = user.email;
      inputPassword.value = "";
      inputPermission.value = user.nivel.toLowerCase().includes("editor")
        ? "editor"
        : "usuario";

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
    const senha = inputPassword.value.trim();
    const permissao = inputPermission.value;

    userList[indexUsuarioEditando].nome = nome;
    userList[indexUsuarioEditando].email = email;
    userList[indexUsuarioEditando].nivel =
      permissao === "editor" ? "Usuário Editor" : "Usuário Leitor";

    if (senha) {
      userList[indexUsuarioEditando].senha = senha;
    }

    renderTable(userList, paginaAtual);
    searchInput.value = "";

    modalAtualizar.classList.remove("is-open");
    modalAtualizando.classList.add("is-open");

    formAtualizar.reset();
    indexUsuarioEditando = null;
  });

  modalConfirmando.addEventListener("click", (event) => {
    const sim = event.target.closest(".btn-primary");
    if (sim && indexParaExcluir !== null) {
      userList.splice(indexParaExcluir, 1);
      indexParaExcluir = null;

      paginaAtual = Math.min(
        paginaAtual,
        Math.ceil(userList.length / usuariosPorPagina)
      );

      renderTable(userList, paginaAtual);
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

  renderTable(userList, paginaAtual);
});
