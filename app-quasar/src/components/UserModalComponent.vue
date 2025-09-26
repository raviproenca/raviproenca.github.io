<template>
  <q-card bordered class="shadow-4 bg-white q-pa-sm">
    <q-card-section class="q-gutter-y-xs">
      <p
        style="border-bottom: 1px solid #ccc; padding-bottom: 7px"
        class="text-weight-bold text-grey-9"
      >
        {{ userData.name }}
      </p>

      <p
        style="border-bottom: 1px solid #ccc; padding-bottom: 7px"
        class="text-weight-bold text-grey-9"
      >
        {{ userData.email }}
      </p>

      <p
        style="border-bottom: 1px solid #ccc; padding-bottom: 7px"
        class="text-weight-bold text-grey-9"
      >
        {{ userData.role === 'ADMIN' ? 'Editor' : 'Leitor' }}
      </p>

      <q-btn
        :to="'/login'"
        color="primary"
        dense
        flat
        rounded
        label="Log out"
        class="full-width"
      ></q-btn>
    </q-card-section>
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
