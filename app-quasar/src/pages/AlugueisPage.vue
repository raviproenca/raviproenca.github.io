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
  { name: 'book', label: 'Nome do Livro', field: 'book', align: 'center' },
  { name: 'renter', label: 'Locatário', field: 'renter', align: 'center' },
  { name: 'rentDate', label: 'Data de Locação', field: 'rentDate', align: 'center', form: false },
  { name: 'deadLine', label: 'Data de Entrega', field: 'deadLine', align: 'center' },
  {
    name: 'devolutionDate',
    label: 'Data de Devolução',
    field: 'devolutionDate',
    align: 'center',
  },
  { name: 'status', label: 'Status', field: 'status', align: 'center', form: false },
  { name: 'actions', label: 'Ações', align: 'center' },
]

const rentStore = useRentsStore()
const { rents } = storeToRefs(rentStore)

onMounted(async () => {
  rentStore.fetchRents()
})
</script>
