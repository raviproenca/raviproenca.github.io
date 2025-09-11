<template>
  <q-card class="q-pa-sm q-pb-xl q-pl-md q-pr-md shadow-4 modal-color">
    <q-card-section style="padding: 0">
      <q-list dense>
        <q-card-actions align="right">
          <q-btn flat dense label="X" color="white" @click="$emit('close-modal')" />
        </q-card-actions>

        <!-- CREATE mode -->
        <div v-if="mode === 'create' || mode === 'edit'">
          <q-item v-for="column in columns" :key="column.name">
            <q-item-section v-if="column.name !== 'actions'">
              <q-item-label caption>{{ column.label }}</q-item-label>
              <q-input
                v-model="localRow[column.field]"
                :placeholder="`Digite o ${column.label.toLowerCase()}`"
                outlined
                dense
                rounded
              />
            </q-item-section>
          </q-item>

          <!-- botões salvar/cancelar -->
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="white" @click="$emit('close-modal')" />
            <q-btn label="Salvar" @click="save" />
          </q-card-actions>
        </div>

        <!-- DELETE confirmation -->
        <div v-else-if="mode === 'delete'">
          <q-item>
            <q-item-section>
              <q-item-label caption>Confirma exclusão?</q-item-label>
              <q-item-label>{{ row?.name || row?.id }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" @click="$emit('close-modal')" />
            <q-btn label="Excluir" color="negative" @click="remove" />
          </q-card-actions>
        </div>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['close-modal'])

const props = defineProps({
  row: { type: Object, default: null },
  mode: { type: String, default: 'create' },
  columns: { type: Array },
})

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
        } // inicializa campos
  },
  { immediate: true },
)

function save() {
  // validações aqui...
  // emitir para o pai — pode enviar localRow ou chamar API aqui
  emit('saved', localRow.value)
}

function remove() {
  emit('deleted', props.row)
}
</script>
