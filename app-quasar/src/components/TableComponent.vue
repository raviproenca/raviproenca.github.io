<template>
  <q-page padding class="column items-center">
    <div class="q-pa-md" style="width: 100%; max-width: 1200px">
      <h4 class="text-white text-center text-weight-bold text-with-shadow q-mt-md q-mb-lg">
        <slot></slot>
      </h4>
      <q-input
        v-model="filter"
        outlined
        :placeholder="placeholder"
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
        class="col"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :grid="$q.screen.lt.md"
        :rows-per-page-options="[5, 10, 20]"
        v-model:pagination="pagination"
        hide-pagination
      >
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6">
            <q-card class="q-mb-md shadow-4 border-radius">
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
                      <q-item-label>{{
                        props.row.role === 'USER' ? 'Leitor' : 'Editor'
                      }}</q-item-label>
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

                  <q-item v-if="props.row.status">
                    <q-item-section>
                      <q-item-label caption>Status</q-item-label>
                      <q-item-label>{{
                        props.row.status === 'RENTED'
                          ? 'Alugado'
                          : props.row.status === 'IN_TIME'
                            ? 'Devolvido no prazo'
                            : props.row.status === 'LATE'
                              ? 'Atrasado'
                              : props.row.status === 'DELIVERED_WITH_DELAY'
                                ? 'Devolvido com atraso'
                                : ''
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>

              <q-separator />

              <q-card-actions align="center">
                <q-btn flat round dense icon="o_edit" color="green" @click="editUser" />
                <q-btn flat round dense icon="o_delete" color="red" @click="deleteUser" />
              </q-card-actions>
            </q-card>
          </div>
        </template>

        <template v-slot:bottom>
          <div class="row justify-center q-mt-md" style="width: 100%">
            <q-pagination
              v-model="pagination.page"
              color="black"
              :max="pagesNumber"
              :max-pages="6"
              boundary-numbers
              size="md"
            />
          </div>
        </template>
      </q-table>

      <template>
        <q-dialog v-model="showModal">
          <biggest-modal @close-modal="showModal = false" />
        </q-dialog>
      </template>
    </div>
  </q-page>
</template>

<style scoped>
.input-style:deep(.q-field__control) {
  box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.25);
}
</style>

<script setup>
import { ref, computed } from 'vue'
import biggestModal from './biggestModal.vue'

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
})

const filter = ref('')

const showModal = ref(false)

const pagination = ref({
  sortBy: 'name',
  descending: true,
  page: 1,
  rowsPerPage: 10,
})

const pagesNumber = computed(() => {
  return Math.ceil(props.rows.length / pagination.value.rowsPerPage)
})

// Supondo que você tenha essas funções
const editUser = () => {
  showModal.value = true
}
const deleteUser = (id) => {
  console.log('Delete user:', id)
}
</script>
