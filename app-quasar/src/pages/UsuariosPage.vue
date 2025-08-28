<template>
  <TableComponent :columns="usuariosth" :rows="usuariostd" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useUsersStore } from 'src/stores/users-store'
import TableComponent from 'src/components/TableComponent.vue'

const usuariosth = [
  { name: 'nome', label: 'Nome Completo', field: 'nome', sortable: true },
  { name: 'email', label: 'Email', field: 'email', sortable: true },
  { name: 'permissao', label: 'Permissão', field: 'permissao' },
]

const usuariostd = ref([])
const userStore = useUsersStore()

onMounted(async () => {
  await userStore.fetchUsers()
  usuariostd.value = userStore.users
})
</script>
