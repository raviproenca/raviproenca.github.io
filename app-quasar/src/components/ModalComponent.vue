<template>
  <q-card class="q-pa-sm q-pb-xl q-pl-md q-pr-md shadow-4 modal-color">
    <q-card-section style="padding: 0">
      <q-list dense>
        <q-card-actions align="right">
          <q-btn flat dense label="X" color="white" @click="$emit('close-modal')" />
        </q-card-actions>

        <q-item>
          <q-item-section>
            <q-item-label caption>Nome</q-item-label>
            <q-input
              type="text"
              placeholder="Digite o nome"
              outlined
              dense
              class="input-style"
              rounded
            ></q-input>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label caption>Email</q-item-label>
            <q-input
              type="email"
              placeholder="Digite o email"
              outlined
              dense
              class="input-style"
              rounded
            ></q-input>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label caption>Permissão</q-item-label>
            <q-select label="Selecione" outlined rounded stack-label dense options-dense />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
const emit = defineEmits(['close-modal'])
console.log(emit)
</script>
