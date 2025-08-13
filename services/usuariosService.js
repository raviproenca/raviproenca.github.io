import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token");

export const fetchUsers = async () => {
  const token = getToken();
  if (!token) throw new Error("Token de autenticação não encontrado.");

  try {
    const response = await axios.get(`${API_BASE_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.name)
      localStorage.setItem("nameUser", response.data.name);

    if (response.data.email)
      localStorage.setItem("emailUser", response.data.email);

    if (response.data.role)
      localStorage.setItem("roleUser", response.data.role);

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const cadastrarUsuario = async (userData) => {
  const token = getToken();
  if (!token) throw new Error("Token de autenticação não encontrado.");

  try {
    const response = await axios.post(`${API_BASE_URL}/user`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const atualizarUsuario = async (userId, userData) => {
  const token = getToken();
  if (!token) throw new Error("Token de autenticação não encontrado.");

  try {
    const response = await axios.put(
      `${API_BASE_URL}/user/${userId}`,
      userData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const excluirUsuario = async (userId) => {
  const token = getToken();
  if (!token) throw new Error("Token de autenticação não encontrado.");

  try {
    await axios.delete(`${API_BASE_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
