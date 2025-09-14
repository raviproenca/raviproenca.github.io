<template>
  <TableComponent
    :columns="booksth"
    :rows="bookstd"
    :placeholder="'Pesquisar livros'"
    area-type="books"
    >Livros</TableComponent
  >
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useBooksStore } from 'src/stores/books-store'
import TableComponent from 'src/components/TableComponent.vue'

const booksth = [
  { name: 'name', label: 'Nome', field: 'name' },
  { name: 'author', label: 'Autor', field: 'author' },
  { name: 'publisher', label: 'Editora', field: 'publisher' },
  { name: 'launchDate', label: 'Data de Lançamento', field: 'launchDate' },
  { name: 'totalQuantity', label: 'Estoque', field: 'totalQuantity' },
  { name: 'totalInUse', label: 'Alugados', field: 'totalInUse' },
]

const bookstd = ref([])
const booksStore = useBooksStore()

onMounted(async () => {
  await booksStore.fetchBooks()
  bookstd.value = booksStore.books
})
</script>
