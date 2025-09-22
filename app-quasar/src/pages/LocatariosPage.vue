<template>
  <TableComponent
    :columns="rentersth"
    :rows="renters"
    :placeholder="'Pesquisar locatários'"
    area-type="renters"
    >Locatários</TableComponent
  >
</template>

<script setup>
import { onMounted } from 'vue'
import { useRentersStore } from 'src/stores/renters-store'
import TableComponent from 'src/components/TableComponent.vue'
import { storeToRefs } from 'pinia'

const rentersth = [
  { name: 'name', label: 'Nome', field: 'name', align: 'center' },
  { name: 'email', label: 'Email', field: 'email', align: 'center' },
  { name: 'telephone', label: 'Telefone', field: 'telephone', align: 'center' },
  { name: 'address', label: 'Endereço', field: 'address', align: 'center' },
  { name: 'cpf', label: 'CPF', field: 'cpf', align: 'center' },
  { name: 'actions', label: 'Ações', align: 'center' },
]

const renterStore = useRentersStore()
const { renters } = storeToRefs(renterStore)

onMounted(async () => {
  renterStore.fetchRenters()
})
</script>
