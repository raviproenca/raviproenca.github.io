<template>
  <TableComponent :columns="usuariosth" :rows="usuariostd" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useUsersStore } from 'src/stores/users-store'
import TableComponent from 'src/components/TableComponent.vue'

const usuariosth = [
  { name: 'name', label: 'Nome', field: 'name'},
  { name: 'email', label: 'Email', field: 'email'},
  { name: 'role', label: 'Permissão', field: 'role' },
]

const usuariostd = ref([])
const userStore = useUsersStore()

onMounted(async () => {
  await userStore.fetchUsers()
  usuariostd.value = userStore.users
})
</script>
