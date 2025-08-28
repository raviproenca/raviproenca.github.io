<template>
  <q-page padding class="column items-center">
    <div class="q-pa-md" style="width: 100%; max-width: 900px">
      <h4 class="text-white text-center text-weight-bold text-with-shadow q-mt-md q-mb-lg">
        Example
      </h4>
      <q-input
        v-model="filter"
        outlined
        placeholder="Buscar example"
        bg-color="white"
        class="q-mb-lg input-style"
        rounded
        dense
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        :grid="$q.screen.lt.md"
        :rows-per-page-options="[5, 10, 20]"
      >
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6">
            <q-card class="q-mb-md">
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
                      <q-item-label>{{ props.row.role }}</q-item-label>
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

                  <q-item v-if="props.row.totalInUse">
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
                </q-list>
              </q-card-section>

              <q-separator />

              <q-card-actions align="center">
                <q-btn flat round icon="o_edit" color="green" @click="editUser(props.row.id)" />
                <q-btn flat round icon="o_delete" color="red" @click="deleteUser(props.row.id)" />
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<style scoped>
.input-style:deep(.q-field__control) {
  box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.25);
}
</style>

<script setup>
const props = defineProps({
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
