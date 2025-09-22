<template>
  <TableComponent
    :columns="booksth"
    :rows="books"
    :placeholder="'Pesquisar livros'"
    area-type="books"
    >Livros</TableComponent
  >
</template>

<script setup>
import { onMounted } from 'vue'
import { useBooksStore } from 'src/stores/books-store'
import TableComponent from 'src/components/TableComponent.vue'
import { storeToRefs } from 'pinia'

const booksth = [
  { name: 'name', label: 'Nome', field: 'name', align: 'center' },
  { name: 'author', label: 'Autor', field: 'author', align: 'center' },
  {
    name: 'publisher',
    label: 'Editora',
    field: 'publisher',
    apiKey: 'publisherId',
    align: 'center',
  },
  { name: 'launchDate', label: 'Data de Lançamento', field: 'launchDate', align: 'center' },
  { name: 'totalQuantity', label: 'Estoque', field: 'totalQuantity', align: 'center' },
  { name: 'totalInUse', label: 'Alugados', field: 'totalInUse', form: false, align: 'center' },
  { name: 'actions', label: 'Ações', align: 'center' },
]

const bookStore = useBooksStore()
const { books } = storeToRefs(bookStore)

onMounted(async () => {
  bookStore.fetchBooks()
})
</script>
