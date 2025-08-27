<template>
  <q-table :title="title" :rows="rows" :columns="columns" row-key="id" />
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Tabela de Dados',
  },
  rows: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
})

console.log(props)
</script>
