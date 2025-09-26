<template>
  <q-card class="shadow-4 bg-white q-pa-md">
    <q-card-section>
      <p>{{ userData.name }}</p>
      <p>{{ userData.email }}</p>
      <p>{{ userData.role }}</p>
    </q-card-section>

    <q-btn
      :to="'/login'"
      color="primary"
      dense
      flat
      rounded
      label="Log out"
      class="full-width"
    ></q-btn>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUsersStore } from 'src/stores/users-store'
import { storeToRefs } from 'pinia'

const userString = localStorage.getItem('user')
const loginUser = ref(userString ? JSON.parse(userString) : null)

const usersStore = useUsersStore()
const { users } = storeToRefs(usersStore)

const userData = computed(() => {
  return users.value.find((user) => user.email === loginUser.value.email)
})
</script>
