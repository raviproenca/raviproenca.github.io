<template>
  <TableComponent :columns="rentersth" :rows="renterstd" :placeholder="'Pesquisar locatários'">Locatários</TableComponent>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRentersStore } from 'src/stores/renters-store'
import TableComponent from 'src/components/TableComponent.vue'

const rentersth = [
  { name: 'name', label: 'Nome', field: 'name' },
  { name: 'email', label: 'Email', field: 'email' },
  { name: 'telephone', label: 'Telefone', field: 'telephone' },
  { name: 'address', label: 'Endereço', field: 'address' },
  { name: 'cpf', label: 'CPF', field: 'cpf' },
]

const renterstd = ref([])
const rentersStore = useRentersStore()

onMounted(async () => {
  await rentersStore.fetchRenters()
  renterstd.value = rentersStore.renters
})
</script>
