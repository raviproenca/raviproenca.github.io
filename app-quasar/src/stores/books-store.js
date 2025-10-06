import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/api'

export const useBooksStore = defineStore('books', () => {
  const books = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchBooks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/book')
      books.value = response.data
    } catch (err) {
      error.value = err.response ? err.response.data.error : 'Erro ao buscar livros.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const registerBook = async (bookData) => {
    loading.value = true
    error.value = null
    try {
      await api.post('/book', bookData)
      await fetchBooks()
    } catch (err) {
      error.value = err.response ? err.response.data.error : 'Erro ao registrar livros.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const editBook = async (bookId, bookData) => {
    loading.value = true
    error.value = null
    try {
      await api.put(`/book/${bookId}`, bookData)
      await fetchBooks()
    } catch (err) {
      error.value = err.response ? err.response.data.error : 'Erro ao editar livro.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteBook = async (bookId) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/book/${bookId}`)
      await fetchBooks()
    } catch (err) {
      error.value = err.response ? err.response.data.error : 'Erro ao deletar livro'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    books,
    loading,
    error,
    fetchBooks,
    registerBook,
    editBook,
    deleteBook,
  }
})
