<template>
  <q-page padding class="column items-center">
    <div class="q-pa-md" style="width: 100%; max-width: 900px">
      <h4 class="text-white text-center text-weight-bold text-with-shadow q-mt-none q-mb-lg">
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
        :filter="filter"
        :rows-per-page-options="[5, 10, 20]"
      >
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            <q-card class="q-mb-md">
              <q-card-section>
                <q-list dense>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Nome</q-item-label>
                      <q-item-label>{{ props.row.name }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Email</q-item-label>
                      <q-item-label>{{ props.row.email }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Permissão</q-item-label>
                      <q-item-label>{{ props.row.permission }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn flat round icon="edit" color="info" @click="editUser(props.row.id)" />
                <q-btn
                  flat
                  round
                  icon="delete"
                  color="negative"
                  @click="deleteUser(props.row.id)"
                />
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
