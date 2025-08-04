import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token");

export const fetchUsers = async () => {
  const token = getToken();
  if (!token) throw new Error("Token de autenticação não encontrado.");

  const response = await axios.get(`${API_BASE_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const cadastrarUsuario = async (userData) => {
  const token = getToken();
  if (!token) throw new Error("Token de autenticação não encontrado.");

  const response = await axios.post(`${API_BASE_URL}/user`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const atualizarUsuario = async (userId, userData) => {
  const token = getToken();
  if (!token) throw new Error("Token de autenticação não encontrado.");

  const response = await axios.put(`${API_BASE_URL}/user/${userId}`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const excluirUsuario = async (userId) => {
  const token = getToken();
  if (!token) throw new Error("Token de autenticação não encontrado.");

  await axios.delete(`${API_BASE_URL}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
