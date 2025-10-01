<template>
  <TableComponent
    :columns="rentsth"
    :rows="rents"
    :placeholder="t('pages.rents.searchPlaceholder')"
    area-type="rents"
    >{{ t('pages.rents.title') }}</TableComponent
  >
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRentsStore } from 'src/stores/rents-store'
import TableComponent from 'src/components/TableComponent.vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const rentsth = computed(() => [
  { name: 'book', label: t('common.book'), field: 'book', align: 'center' },
  { name: 'renter', label: t('common.renter'), field: 'renter', align: 'center' },
  {
    name: 'rentDate',
    label: t('common.rentDate'),
    field: 'rentDate',
    align: 'center',
    form: false,
  },
  { name: 'deadLine', label: t('common.deadLine'), field: 'deadLine', align: 'center' },
  {
    name: 'devolutionDate',
    label: t('common.devolutionDate'),
    field: 'devolutionDate',
    align: 'center',
  },
  { name: 'status', label: 'Status', field: 'status', align: 'center', form: false },
  { name: 'actions', label: t('common.actions'), align: 'center' },
])

const rentStore = useRentsStore()
const { rents } = storeToRefs(rentStore)

onMounted(async () => {
  rentStore.fetchRents()
})
</script>
