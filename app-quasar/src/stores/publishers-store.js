import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'boot/api'

export const usePublishersStore = defineStore('publishers', () => {
  const publishers = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchPublishers = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/publisher')
      publishers.value = response.data
    } catch (err) {
      error.value = err.response ? err.response.data.message : 'Erro ao buscar editoras.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    publishers,
    loading,
    error,
    fetchPublishers,
  }
})
