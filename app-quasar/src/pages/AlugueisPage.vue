<template>
  <TableComponent
    :columns="rentsth"
    :rows="rents"
    :placeholder="'Pesquisar aluguéis'"
    area-type="rents"
    >Aluguéis</TableComponent
  >
</template>

<script setup>
import { onMounted } from 'vue'
import { useRentsStore } from 'src/stores/rents-store'
import TableComponent from 'src/components/TableComponent.vue'
import { storeToRefs } from 'pinia'

const rentsth = [
  { name: 'name', label: 'Nome do Livro', field: 'name', align: 'center' },
  { name: 'renter', label: 'Locatário', field: 'renter', align: 'center' },
  { name: 'rentDate', label: 'Data de Locação', field: 'rentDate', align: 'center' },
  { name: 'devolutionDate', label: 'Data de Devolução', field: 'devolutionDate', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Ações', align: 'center' },
]

const rentStore = useRentsStore()
const { rents } = storeToRefs(rentStore)

onMounted(async () => {
  rentStore.fetchRents()
})
</script>
