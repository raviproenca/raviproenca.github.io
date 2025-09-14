<template>
  <q-card class="shadow-4 modal-color border-radius" style="width: 80%; max-width: 600px">
    <q-card-section>
      <q-list>
        <q-card-actions align="right">
          <q-btn
            flat
            dense
            label="X"
            color="white"
            @click="$emit('close-modal')"
            :disable="isLoading"
          />
        </q-card-actions>

        <!-- CREATE mode -->
        <div v-if="mode === 'create' || mode === 'edit'">
          <q-item v-for="column in columns" :key="column.name">
            <q-item-section v-if="column.name !== 'actions'">
              <q-item-label caption>{{ column.label }}</q-item-label>
              <q-input
                v-if="column.name !== 'role'"
                dark
                color="amber-1"
                v-model="localRow[column.field]"
                :placeholder="`Digitar ${column.label.toLowerCase()}`"
                dense
                rounded
              />
              <q-select
                v-if="column.name === 'role'"
                dark
                color="amber-1"
                v-model="localRow[column.field]"
                :options="roleOptions"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                dense
                rounded
              />
            </q-item-section>
          </q-item>

          <!-- botões salvar/cancelar -->
          <q-card-actions align="right" class="q-pa-md q-mt-lg">
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
              @click="save()"
              :loading="isLoading"
              :disable="isLoading"
            />
            <q-btn
              v-if="mode === 'edit'"
              label="Atualizar"
              color="blue"
              @click="edit()"
              :loading="isLoading"
              :disable="isLoading"
            />
          </q-card-actions>
        </div>

        <!-- DELETE confirmation -->
        <div v-else-if="mode === 'delete'">
          <q-item>
            <q-item-section>
              <q-item-label class="text-h5">Confirma exclusão?</q-item-label>
              <q-item-label>{{ row?.name || row?.id }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-card-actions align="right">
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
      </q-list>
    </q-card-section>
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

const props = defineProps({
  row: { type: Object, default: null },
  mode: { type: String, default: 'create' },
  area: { type: String, default: '' },
  columns: { type: Array },
})

const roleOptions = [
  { value: 'USER', label: 'Leitor' },
  { value: 'ADMIN', label: 'Editor' },
]

const localRow = ref({})

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
        } // inicializa campos
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
</script>
