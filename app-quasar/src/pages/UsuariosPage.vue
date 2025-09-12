<template>
  <TableComponent
    :columns="usersth"
    :rows="userstd"
    :placeholder="'Pesquisar usuários'"
    :area-type="'users'"
    >Usuários</TableComponent
  >
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useUsersStore } from 'src/stores/users-store'
import TableComponent from 'src/components/TableComponent.vue'

const usersth = [
  { name: 'name', label: 'Nome', field: 'name' },
  { name: 'email', label: 'Email', field: 'email' },
  { name: 'password', label: 'Senha', field: 'password' },
  { name: 'role', label: 'Permissão', field: 'role' },
]

const userstd = ref([])
const userStore = useUsersStore()

onMounted(async () => {
  await userStore.fetchUsers()
  userstd.value = userStore.users
})
</script>
