<template>
  <q-card class="shadow-4 bg-white q-pa-md">
    <q-card-section>
      <p>Carlos Alberto</p>
      <p>carlos@example.com</p>
      <p>Leitor</p>
    </q-card-section>

    <q-btn
      :to="'/login'"
      color="primary"
      dense
      flat
      rounded
      label="Log out"
      class="full-width"
    ></q-btn>
  </q-card>
</template>
