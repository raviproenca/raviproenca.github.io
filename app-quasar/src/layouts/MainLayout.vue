<template>
  <q-layout view="lHh Lpr lFf" class="background-color">
    <q-header elevated class="header-color">
      <q-toolbar class="row justify-between">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="q-pl-md"> Locadora de Livros </q-toolbar-title>

        <q-btn dense round icon="o_person" color="white" text-color="black" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above class="nav-color">
      <div class="flex flex-center q-pa-md">
        <q-img src="src/assets/WDA GROUP LOGO.png" style="width: 100px" />
      </div>
      <q-list>
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" class="q-mt-lg" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Dashboard',
    caption: 'quasar.dev',
    icon: 'school',
    link: '/app/dashboard',
  },
  {
    title: 'Usuários',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: '/app/usuarios',
  },
  {
    title: 'Editoras',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: '/app/editoras',
  },
  {
    title: 'Livros',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: '/app/livros',
  },
  {
    title: 'Locatários',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: '/app/locatarios',
  },
  {
    title: 'Aluguéis',
    caption: '@QuasarFramework',
    icon: 'public',
    link: '/app/alugueis',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
