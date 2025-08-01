import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const formLogin = document.getElementById("form-login");

const registerNameInput = document.getElementById("login-name");
const registerEmailInput = document.getElementById("login-email");
const registerPasswordInput = document.getElementById("login-password");

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
    registerEmailInput.setCustomValidity("Por favor, insira um email válido.");
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

formLogin.addEventListener("submit", async (event) => {
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
    registerEmailInput.setCustomValidity("Por favor, insira um email válido.");
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

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: registerEmailInput.value.trim(),
      password: registerPasswordInput.value.trim(),
    });

    console.log("Login realizado:", response.data);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    window.location.href = "/views/dashboard.html";
  } catch (error) {
    if (error.response) {
      console.error("STATUS:", error.response.status);
      console.error("HEADERS:", error.response.headers);
      console.error("DATA:", error.response.data);
      alert("Erro: " + (error.response.data?.message || "verifique os dados"));
    } else if (error.request) {
      console.error("A requisição foi feita mas não houve resposta:");
      console.error(error.request);
      alert("Sem resposta da API. Verifique a URL ou o servidor.");
    } else {
      console.error("Erro ao configurar a requisição:");
      console.error(error.message);
      alert("Erro desconhecido: " + error.message);
    }
  }
});
