<template>
  <TableComponent
    :columns="rentersth"
    :rows="renters"
    :placeholder="t('pages.renters.searchPlaceholder')"
    area-type="renters"
    >{{ t('pages.renters.title') }}</TableComponent
  >
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRentersStore } from 'src/stores/renters-store'
import TableComponent from 'src/components/TableComponent.vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const rentersth = computed(() => [
  { name: 'name', label: t('common.name'), field: 'name', align: 'center' },
  { name: 'email', label: t('common.email'), field: 'email', align: 'center' },
  { name: 'telephone', label: t('common.telephone'), field: 'telephone', align: 'center' },
  { name: 'address', label: t('common.address'), field: 'address', align: 'center' },
  { name: 'cpf', label: t('common.cpf'), field: 'cpf', align: 'center' },
  { name: 'actions', label: t('common.actions'), align: 'center' },
])

const renterStore = useRentersStore()
const { renters } = storeToRefs(renterStore)

onMounted(async () => {
  renterStore.fetchRenters()
})
</script>
