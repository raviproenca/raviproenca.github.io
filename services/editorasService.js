// --- services/editorasService.js ---
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token");

export const fetchEditoras = async () => {
  try {
    const token = getToken();
    if (!token) {
      console.error("Token não encontrado. Redirecionando para login.");
      window.location.href = "/";
      return [];
    }

    const response = await axios.get(`${API_BASE_URL}/publisher`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      alert("Sessão expirada. Faça login novamente.");
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    throw error;
  }
};

export const cadastrarEditora = async (editoraData) => {
  try {
    const token = getToken();
    if (!token) return;

    await axios.post(`${API_BASE_URL}/publisher`, editoraData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error;
  }
};

export const atualizarEditora = async (editoraId, editoraData) => {
  try {
    const token = getToken();
    if (!token) return;

    await axios.put(`${API_BASE_URL}/publisher/${editoraId}`, editoraData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error;
  }
};

export const excluirEditora = async (editoraId) => {
  try {
    const token = getToken();
    if (!token) return;

    await axios.delete(`${API_BASE_URL}/publisher/${editoraId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error;
  }
};
