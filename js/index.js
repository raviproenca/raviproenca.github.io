const formLogin = document.getElementById("form-login");

formLogin.addEventListener("submit", (event) => {
  if (!formLogin.checkValidity()) return;
  event.preventDefault();

  const nomeInput = document.getElementById("login-name");
  const emailInput = document.getElementById("login-email");
  const senhaInput = document.getElementById("login-password");

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();

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

  window.location.href = "/views/dashboard.html";
});
