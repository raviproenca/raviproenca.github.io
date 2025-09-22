<template>
  <TableComponent
    :columns="publishersth"
    :rows="publishers"
    :placeholder="'Pesquisar editoras'"
    :area-type="'publishers'"
    >Editoras</TableComponent
  >
</template>

<script setup>
import { onMounted } from 'vue'
import { usePublishersStore } from 'src/stores/publishers-store'
import { storeToRefs } from 'pinia'
import TableComponent from 'src/components/TableComponent.vue'

const publishersth = [
  { name: 'name', label: 'Nome', field: 'name', align: 'center' },
  { name: 'email', label: 'Email', field: 'email', align: 'center' },
  { name: 'telephone', label: 'Telefone', field: 'telephone', align: 'center' },
  { name: 'site', label: 'Site', field: 'site', align: 'center' },
  { name: 'actions', label: 'Ações', align: 'center' },
]

const publisherStore = usePublishersStore()
const { publishers } = storeToRefs(publisherStore)

onMounted(async () => {
  publisherStore.fetchPublishers()
})
</script>
