<template>
  <TableComponent
    :columns="usersth"
    :rows="users"
    :placeholder="'Pesquisar usuários'"
    :area-type="'users'"
    >Usuários</TableComponent
  >
</template>

<script setup>
import { onMounted } from 'vue'
import { useUsersStore } from 'src/stores/users-store'
import { storeToRefs } from 'pinia'
import TableComponent from 'src/components/TableComponent.vue'

const usersth = [
  { name: 'name', label: 'Nome', field: 'name', align: 'center' },
  { name: 'email', label: 'Email', field: 'email', align: 'center' },
  { name: 'password', label: 'Senha', field: 'password' },
  { name: 'role', label: 'Permissão', field: 'role', align: 'center' },
  { name: 'actions', label: 'Ações', align: 'center' },
]

const userStore = useUsersStore()

const { users } = storeToRefs(userStore)

onMounted(async () => {
  userStore.fetchUsers()
})
</script>
