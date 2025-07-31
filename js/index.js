import axios from "axios";

const formLogin = document.getElementById("form-login");

formLogin.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!formLogin.checkValidity()) return;

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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: email,
      password: senha,
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
