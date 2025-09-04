import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/api'

export const useRentsStore = defineStore('rents', () => {
  const rents = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchRents = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/rent')
      rents.value = response.data
    } catch (err) {
      error.value = err.response ? err.response.data.message : 'Erro ao buscar aluguéis.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    rents,
    loading,
    error,
    fetchRents,
  }
})
