<template>
  <q-card class="shadow-4 modal-color border-radius q-pa-md" style="width: 80%; max-width: 600px">
    <q-card-actions align="right" class="q-pa-xs">
      <q-btn
        flat
        round
        dense
        icon="close"
        color="white"
        @click="$emit('close-modal')"
        :disable="isLoading"
      />
    </q-card-actions>

    <q-form v-if="mode === 'create' || mode === 'edit'" ref="myForm" @submit.prevent="handleSubmit">
      <q-card-section class="q-gutter-y-sm">
        <div v-for="column in columns" :key="column.name">
          <div v-if="column.name !== 'actions'">
            <q-item-label caption>{{ column.label }}</q-item-label>
            <q-input
              v-if="column.name !== 'role'"
              dark
              color="amber-1"
              v-model="localRow[column.field]"
              :placeholder="`Digitar ${column.label.toLowerCase()}`"
              :rules="getRulesFor(column)"
              lazy-rules
              debounce="500"
              dense
              rounded
            />
            <q-select
              v-if="column.name === 'role'"
              dark
              color="amber-1"
              v-model="localRow[column.field]"
              :options="roleOptions"
              :rules="getRulesFor(column)"
              lazy-rules
              option-value="value"
              option-label="label"
              emit-value
              map-options
              dense
              rounded
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Cancelar"
          color="white"
          @click="$emit('close-modal')"
          :disable="isLoading"
        />
        <q-btn
          v-if="mode === 'create'"
          label="Cadastrar"
          color="green"
          type="submit"
          :loading="isLoading"
          :disable="isLoading"
        />
        <q-btn
          v-if="mode === 'edit'"
          label="Atualizar"
          color="blue"
          type="submit"
          :loading="isLoading"
          :disable="isLoading"
        />
      </q-card-actions>
    </q-form>

    <div v-else-if="mode === 'delete'">
      <q-card-section>
        <div class="text-h5">Confirma exclusão?</div>
        <div>{{ row?.name || row?.id }}</div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Cancelar"
          color="white"
          @click="$emit('close-modal')"
          :disable="isLoading"
        />
        <q-btn
          label="Excluir"
          color="negative"
          @click="remove"
          :loading="isLoading"
          :disable="isLoading"
        />
      </q-card-actions>
    </div>
  </q-card>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useUsersStore } from 'src/stores/users-store'
import { usePublishersStore } from 'src/stores/publishers-store'
import { useBooksStore } from 'src/stores/books-store'
import { useRentersStore } from 'src/stores/renters-store'
import { useRentsStore } from 'src/stores/rents-store'

const emit = defineEmits(['close-modal'])

const myForm = ref(null)
const localRow = ref({})

const props = defineProps({
  row: { type: Object, default: null },
  existingItems: { type: Array, default: () => [] },
  mode: { type: String, default: 'create' },
  area: { type: String, default: '' },
  columns: { type: Array },
})

const roleOptions = [
  { value: 'USER', label: 'Leitor' },
  { value: 'ADMIN', label: 'Editor' },
]

watch(
  () => props.row,
  (r) => {
    localRow.value = r
      ? { ...r }
      : {
          name: '',
          email: '',
          role: '',
          telephone: '',
          site: '',
          author: '',
          publisher: '',
          launchDate: '',
          totalQuantity: '',
          totalInUse: '',
          address: '',
          cpf: '',
          book: '',
          renter: '',
          rentDate: '',
          devolutionDate: '',
          status: '',
        }
  },
  { immediate: true },
)

const activeStore = computed(() => {
  switch (props.area) {
    case 'users':
      return useUsersStore()
    case 'publishers':
      return usePublishersStore()
    case 'books':
      return useBooksStore()
    case 'renters':
      return useRentersStore()
    case 'rents':
      return useRentsStore()
    default:
      return null
  }
})

const isLoading = computed(() => {
  if (!activeStore.value) return false

  const { loading } = storeToRefs(activeStore.value)
  return loading.value
})

const save = async () => {
  const payload = {}

  props.columns.forEach((column) => {
    if (column.field && Object.prototype.hasOwnProperty.call(localRow.value, column.field)) {
      payload[column.field] = localRow.value[column.field]
    }
  })

  const store = activeStore.value
  if (!store) return console.error('Store não encontrada para a área:', props.area)

  if (props.area === 'users') await store.registerUser(payload)
  else if (props.area === 'publishers') await store.registerPublisher(payload)
  else if (props.area === 'books') await store.registerBook(payload)
  else if (props.area === 'renters') await store.registerRenter(payload)
  else if (props.area === 'rents') await store.registerRent(payload)
  else console.log('ERRO!!')

  emit('close-modal')
}

const edit = async () => {
  const payload = {}

  props.columns.forEach((column) => {
    if (column.field && Object.prototype.hasOwnProperty.call(localRow.value, column.field)) {
      payload[column.field] = localRow.value[column.field]
    }
  })

  const store = activeStore.value
  if (!store) return console.error('Store não encontrada para a área:', props.area)

  if (props.area === 'users') await store.editUser(props.row.id, payload)
  else if (props.area === 'publishers') await store.editPublisher(props.row.id, payload)
  else if (props.area === 'books') await store.editBook(props.row.id, payload)
  else if (props.area === 'renters') await store.editRenter(props.row.id, payload)
  else if (props.area === 'rents') await store.editRent(props.row.id, payload)
  else console.log('ERRO!!')

  emit('close-modal')
}

const remove = async () => {
  const store = activeStore.value
  if (!store) return console.error('Store não encontrada para a área:', props.area)

  if (props.area === 'users') await store.deleteUser(props.row.id)
  else if (props.area === 'publishers') await store.deletePublisher(props.row.id)
  else if (props.area === 'books') await store.deleteBook(props.row.id)
  else if (props.area === 'renters') await store.deleteRenter(props.row.id)
  else if (props.area === 'rents') await store.deleteRent(props.row.id)
  else console.log('ERRO!!')

  emit('close-modal')
}

const requiredRule = [(val) => (val && String(val).length > 0) || 'Este campo é obrigatório']

function isUnique(value, field, items, mode, currentRow) {
  if (!value) return true

  const inputValue = typeof value === 'string' ? value.toLowerCase().trim() : value

  const isTaken = items.some((item) => {
    const itemValue = item[field]

    if (itemValue === null || itemValue === undefined) return false

    const formattedItemValue =
      typeof itemValue === 'string' ? itemValue.toLowerCase().trim() : itemValue

    if (formattedItemValue === inputValue) {
      if (mode === 'edit') {
        return item.id !== currentRow.id
      }
      return true
    }

    return false
  })

  return !isTaken
}

const nameRules = [
  (val) => (val && val.length > 0) || 'O campo nome é obrigatório',
  (val) => val.length >= 3 || 'O nome precisa ter no mínimo 3 caracteres',
  (val) => !/\d/.test(val) || 'O nome não pode conter números',
  (val) =>
    isUnique(val, 'name', props.existingItems, props.mode, props.row) ||
    'Este nome de usuário já está em uso.',
]

const emailRules = [
  (val) => (val && val.length > 0) || 'O campo email é obrigatório',
  (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val || '').trim()) || 'O formato do email é inválido',
  (val) =>
    isUnique(val, 'email', props.existingItems, props.mode, props.row) ||
    'Este email já está em uso.',
]

function getRulesFor(column) {
  switch (column.field) {
    case 'name':
      return nameRules
    case 'email':
      return emailRules
    // case 'password':
    //   return passwordRules;
    // Para todos os outros, podemos exigir que sejam preenchidos
    default:
      return requiredRule
  }
}

const handleSubmit = async () => {
  const success = await myForm.value.validate()

  if (success) {
    if (props.mode === 'create') {
      await save()
    } else if (props.mode === 'edit') {
      await edit()
    }
  } else {
    // A UI do Quasar já mostrou os erros nos campos
    console.log('Formulário inválido. Por favor, corrija os erros.')
  }
}
</script>
