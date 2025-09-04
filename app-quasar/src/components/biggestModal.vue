<template>
  <q-card class="q-pa-sm shadow-4 border-radius modal-color">
    <q-card-section>
      <q-list dense>
        <q-item v-if="props.row.name">
          <q-item-section>
            <q-item-label caption>Nome</q-item-label>
            <q-item-label>{{ props.row.name }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="props.row.email">
          <q-item-section>
            <q-item-label caption>Email</q-item-label>
            <q-item-label>{{ props.row.email }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="props.row.role">
          <q-item-section>
            <q-item-label caption>Permissão</q-item-label>
            <q-item-label>{{ props.row.role === 'USER' ? 'Leitor' : 'Editor' }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="props.row.telephone">
          <q-item-section>
            <q-item-label caption>Telefone</q-item-label>
            <q-item-label>{{ props.row.telephone }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="props.row.site">
          <q-item-section>
            <q-item-label caption>Site</q-item-label>
            <q-item-label>{{ props.row.site }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="props.row.author">
          <q-item-section>
            <q-item-label caption>Autor</q-item-label>
            <q-item-label>{{ props.row.author }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="props.row.publisher">
          <q-item-section>
            <q-item-label caption>Editora</q-item-label>
            <q-item-label>{{ props.row.publisher.name }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="props.row.launchDate">
          <q-item-section>
            <q-item-label caption>Data de Lançamento</q-item-label>
            <q-item-label>{{ props.row.launchDate }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="props.row.totalQuantity">
          <q-item-section>
            <q-item-label caption>Estoque</q-item-label>
            <q-item-label>{{ props.row.totalQuantity }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="props.row.totalInUse >= 0">
          <q-item-section>
            <q-item-label caption>Alugados</q-item-label>
            <q-item-label>{{ props.row.totalInUse }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="props.row.address">
          <q-item-section>
            <q-item-label caption>Endereço</q-item-label>
            <q-item-label>{{ props.row.address }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="props.row.cpf">
          <q-item-section>
            <q-item-label caption>CPF</q-item-label>
            <q-item-label>{{ props.row.cpf }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="props.row.book">
          <q-item-section>
            <q-item-label caption>Livro</q-item-label>
            <q-item-label>{{ props.row.book.name }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="props.row.renter">
          <q-item-section>
            <q-item-label caption>Locatário</q-item-label>
            <q-item-label>{{ props.row.renter.name }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="props.row.rentDate">
          <q-item-section>
            <q-item-label caption>Data de Locação</q-item-label>
            <q-item-label>{{ props.row.rentDate }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="props.row.devolutionDate">
          <q-item-section>
            <q-item-label caption>Data de Devolução</q-item-label>
            <q-item-label>{{ props.row.devolutionDate }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Fechar" color="black" @click="$emit('close-modal')" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
const emit = defineEmits(['close-modal'])

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
})
console.log(emit)
</script>
