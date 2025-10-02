<template>
  <q-page padding class="flex flex-center">
    <div class="row q-mx-auto" style="width: 100%; max-width: 1400px">
      <div class="col-12 col-md-6 q-pa-sm">
        <q-card class="dashboard-cards border-radius q-mb-md">
          <q-card-section>
            <p
              :class="[
                'text-white',
                'text-center',
                'text-weight-bolder',
                $q.screen.lt.md ? 'text-h6' : 'text-h5',
              ]"
              style="opacity: 60%"
            >
              Livros mais alugados
            </p>

            <div class="row justify-center items-center q-gutter-x-lg q-mt-sm">
              <div class="column items-center q-gutter-y-md">
                <q-icon
                  name="emoji_events"
                  class="primeiro-mais-alugado"
                  :size="$q.screen.lt.md ? 'md' : 'xl'"
                ></q-icon>
                <q-icon
                  name="workspace_premium"
                  class="segundo-mais-alugado"
                  :size="$q.screen.lt.md ? 'sm' : 'lg'"
                ></q-icon>
                <q-icon
                  name="military_tech"
                  class="terceiro-mais-alugado"
                  :size="$q.screen.lt.md ? 'sm' : 'lg'"
                ></q-icon>
              </div>

              <div class="column q-gutter-y-sm">
                <p :class="['text-white', 'text-weight-bolder', pSizes(), 'book-title-align']">
                  {{ firstBook?.name || 'Carregando...' }}
                </p>
                <p :class="['text-white', 'text-weight-bolder', pSizes(), 'book-title-align']">
                  {{ secondBook?.name || 'Carregando...' }}
                </p>
                <p :class="['text-white', 'text-weight-bolder', pSizes(), 'book-title-align']">
                  {{ thirdBook?.name || 'Carregando...' }}
                </p>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <div class="row justify-center">
          <q-card class="dashboard-cards border-radius col-grow q-mr-sm">
            <q-card-section class="q-gutter-y-sm">
              <div class="row justify-between">
                <q-icon name="o_library_add_check" size="sm" color="white" />
                <p class="text-white text-weight-bold">{{ rentedBooks }}</p>
              </div>
              <p class="text-white text-weight-bold">Livros alugados no último mês</p>
            </q-card-section>
          </q-card>

          <q-card class="dashboard-cards border-radius col-grow q-ml-sm">
            <q-card-section class="q-gutter-y-sm">
              <div class="row justify-between">
                <q-icon name="schedule" size="sm" color="white" />
                <p class="text-white text-weight-bold">{{ rentedLateBooks }}</p>
              </div>
              <p class="text-white text-weight-bold">Livros atrasados no momento</p>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="col-12 col-md-6 q-pa-sm column">
        <q-card class="dashboard-cards border-radius col-grow">
          <q-card-section class="column full-height">
            <q-select
              v-model="selectedRenter"
              dark
              dense
              rounded
              :options="perRenter"
              option-value="name"
              option-label="name"
              map-options
              emit-value
              label="Selecione um locatário"
              clearable
            />
            <div class="q-mt-md col-grow">
              <div style="position: relative; height: 98%; width: 100%">
                <q-inner-loading :showing="isLoading" label="Calculando dados do gráfico..." />

                <div v-if="error" class="fullscreen text-center flex-center">
                  <div class="text-negative">
                    <q-icon name="error" size="lg" />
                    <p>{{ error }}</p>
                  </div>
                </div>

                <canvas v-show="!isLoading && !error" ref="chartDoughnutCanvas"></canvas>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-12 q-pa-sm">
        <q-card class="dashboard-cards border-radius">
          <q-card-section style="padding: 8px 16px">
            <div style="position: relative; height: 350px">
              <q-inner-loading :showing="isLoading" label="Calculando dados do gráfico..." />

              <div v-if="error" class="fullscreen text-center flex-flex-center">
                <div class="text-negative">
                  <q-icon name="error" size="lg" />
                  <p>{{ error }}</p>
                </div>
              </div>

              <canvas v-show="!isLoading && !error" ref="chartBarCanvas"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style>
.book-title-align {
  transform: translateY(10px);
}
</style>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useDashboardsStore } from 'src/stores/dashboard-store'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const store = useDashboardsStore()
const {
  bookMoreRented,
  deliveredInTimeQuantity,
  deliveredWithDelayQuantity,
  rentsQuantity,
  rentsLateQuantity,
  rentsPerRenter,
} = storeToRefs(store)

const firstBook = computed(() => bookMoreRented.value.data?.[0])
const secondBook = computed(() => bookMoreRented.value.data?.[1])
const thirdBook = computed(() => bookMoreRented.value.data?.[2])

const rentedBooks = computed(() => rentsQuantity.value.data)
const rentedLateBooks = computed(() => rentsLateQuantity.value.data)

const perRenter = computed(() => rentsPerRenter.value.data?.content)

const selectedRenter = ref(null)

const $q = useQuasar()
const chartBarCanvas = ref(null)
const chartDoughnutCanvas = ref(null)

const pSizes = () => {
  return $q.screen.lt.md ? 'text-subtitle1' : 'text-h6'
}

let chartDoughnutInstance = null
let chartBarInstance = null

const isLoading = computed(
  () =>
    bookMoreRented.value.loading ||
    deliveredInTimeQuantity.value.loading ||
    deliveredWithDelayQuantity.value.loading,
)

const error = computed(
  () =>
    bookMoreRented.value.error ||
    deliveredInTimeQuantity.value.error ||
    deliveredWithDelayQuantity.value.error,
)

const chartDoughnutData = computed(() => {
  const limeGreen = '#A7ED4A'
  const purple = '#9B59B6'

  const renterData = perRenter.value.find((renter) => renter.name === selectedRenter.value)

  const activeRents = renterData?.rentsActive
  const totalRents = renterData?.rentsQuantity

  return {
    labels: ['Livros alugados no momento', 'Total de aluguéis realizados'],
    datasets: [
      {
        label: 'Status dos Livros',
        data: [activeRents, totalRents],
        backgroundColor: [limeGreen, purple],
        borderColor: [limeGreen, purple],
        borderWidth: 1,
      },
    ],
  }
})

const chartBarData = computed(() => {
  return {
    labels: ['Maio', 'Junho', 'Julho', 'Agosto', 'Setembro'],
    datasets: [
      {
        label: 'Entregue no prazo',
        data: [10, 15, 25, 35, 50],
        backgroundColor: '#00C9FF',
        borderRadius: 6,
      },
      {
        label: 'Entregue com atraso',
        data: [5, 10, 15, 20, 35],
        backgroundColor: '#FF7F00',
        borderRadius: 6,
      },
    ],
  }
})

const chartDoughnutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1200,
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#fff',
        font: {
          size: 11,
          weight: 700,
        },
        padding: 10,
        boxWidth: 14,
      },
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: function (context) {
          let label = context.label || ''
          if (label) label += ': '
          if (context.parsed !== null) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            label += context.parsed + ' (' + percentage + '%)'
          }
          return label
        },
      },
    },
    title: {
      display: false,
    },
  },
}))

const chartBarOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
    easing: 'easeOutQuart',
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: 'white',
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value =
            context.chart.options.indexAxis === 'y' ? context.parsed.x : context.parsed.y
          return `${context.dataset.label}: ${value}`
        },
      },
    },
    subtitle: {
      display: true,
      text: `Total no prazo (últimos 5 meses): 60 | Total com atraso: 25`,
      color: '#fff',
      font: {
        size: 12,
        weight: 'normal',
      },
      padding: {
        bottom: 15,
        top: 5,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: 'white' },
      grid: { color: $q.dark.isActive ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
    },
    x: {
      ticks: { color: 'white' },
      grid: { color: $q.dark.isActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
    },
  },
}))

onMounted(() => {
  store.fetchBookMoreRented(3)
  store.fetchDeliveredInTimeQuantity(5)
  store.fetchDeliveredWithDelayQuantity(5)
  store.fetchRentsQuantity(1)
  store.fetchRentsLateQuantity(1)
  store.fetchRentsPerRenter()
})

watchEffect(() => {
  const ctxDoughnut = chartDoughnutCanvas.value?.getContext('2d')
  const ctxBar = chartBarCanvas.value?.getContext('2d')

  if (ctxBar && chartBarData.value) {
    if (chartBarInstance) {
      chartBarInstance.destroy()
    }
    chartBarInstance = new Chart(ctxBar, {
      type: 'bar',
      data: chartBarData.value,
      options: chartBarOptions.value,
    })
  }

  if (ctxDoughnut && chartDoughnutData.value) {
    if (chartDoughnutInstance) {
      chartDoughnutInstance.destroy()
    }
    chartDoughnutInstance = new Chart(ctxDoughnut, {
      type: 'doughnut',
      data: chartDoughnutData.value,
      options: chartDoughnutOptions.value,
    })
  }
})

onBeforeUnmount(() => {
  if (chartBarInstance) {
    chartBarInstance.destroy()
    chartBarInstance = null
  }
  if (chartDoughnutInstance) {
    chartDoughnutInstance.destroy()
    chartDoughnutInstance = null
  }
})
</script>
