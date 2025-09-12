<template>
  <TableComponent
    :columns="publishersth"
    :rows="publisherstd"
    :placeholder="'Pesquisar editoras'"
    :area-type="'publishers'"
    >Editoras</TableComponent
  >
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { usePublishersStore } from 'src/stores/publishers-store'
import TableComponent from 'src/components/TableComponent.vue'

const publishersth = [
  { name: 'name', label: 'Nome', field: 'name' },
  { name: 'email', label: 'Email', field: 'email' },
  { name: 'telephone', label: 'Telefone', field: 'telephone' },
  { name: 'site', label: 'Site', field: 'site' },
]

const publisherstd = ref([])
const publishersStore = usePublishersStore()

onMounted(async () => {
  await publishersStore.fetchPublishers()
  publisherstd.value = publishersStore.publishers
})
</script>
