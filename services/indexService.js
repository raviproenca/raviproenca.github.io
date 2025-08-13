import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });

    if (response.data.token) localStorage.setItem("token", response.data.token);

    if (response.data.name)
      localStorage.setItem("nameUser", response.data.name);

    if (response.data.email)
      localStorage.setItem("emailUser", response.data.email);

    if (response.data.role)
      localStorage.setItem("roleUser", response.data.role);

    console.log(response.data.name);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

const handleAxiosError = (error) => {
  if (error.response) {
    throw new Error(error.response.data?.message || "Erro de resposta da API.");
  } else if (error.request) {
    throw new Error("Sem resposta do servidor. Verifique sua conexão.");
  } else {
    throw new Error("Erro ao realizar requisição: " + error.message);
  }
};
