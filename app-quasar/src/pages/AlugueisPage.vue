<template>
  <TableComponent :columns="rentsth" :rows="rentstd" :placeholder="'Pesquisar aluguéis'">Aluguéis</TableComponent>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRentsStore } from 'src/stores/rents-store'
import TableComponent from 'src/components/TableComponent.vue'

const rentsth = [
  { name: 'name', label: 'Nome do Livro', field: 'name' },
  { name: 'renter', label: 'Locatário', field: 'renter' },
  { name: 'rentDate', label: 'Data de Locação', field: 'rentDate' },
  { name: 'devolutionDate', label: 'Data de Devolução', field: 'devolutionDate' },
  { name: 'status', label: 'Status', field: 'status' },
]

const rentstd = ref([])
const rentsStore = useRentsStore()

onMounted(async () => {
  await rentsStore.fetchRents()
  rentstd.value = rentsStore.rents
})
</script>
