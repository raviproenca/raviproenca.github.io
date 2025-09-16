<template>
  <q-page padding>
    <div class="row q-gutter-lg q-pa-md" style="width: 100%; max-width: 1200px">
      <div class="col-12 col-md">
        <q-card class="dashboard-cards border-radius">
          <q-card-section>
            <h5>Teste1</h5>
            <h5>Teste2</h5>
            <h5>Teste3</h5>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md">
        <q-card class="dashboard-cards border-radius">
          <q-card-section>
            <h5>Teste4</h5>
            <h5>Teste5</h5>
            <h5>Teste6</h5>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md">
        <q-card class="dashboard-cards border-radius">
          <q-card-section style="padding: 8px 16px">
            <div style="height: 400px; position: relative">
              <q-inner-loading :showing="isLoading" label="Calculando dados do gráfico..." />

              <div v-if="error" class="fullscreen text-center flex flex-center">
                <div class="text-negative">
                  <q-icon name="error" size="lg" />
                  <p>{{ error }}</p>
                </div>
              </div>

              <canvas
                v-show="!isLoading && !error"
                ref="chartCanvas"
                style="width: 100%; height: 100%; display: block"
              ></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useDashboardsStore } from 'src/stores/dashboard-store'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const store = useDashboardsStore()
const { deliveredInTimeQuantity, deliveredWithDelayQuantity } = storeToRefs(store)

const $q = useQuasar()
const chartCanvas = ref(null)
let chartInstance = null

// 'isLoading' será verdadeiro se QUALQUER uma das buscas estiver em andamento.
const isLoading = computed(
  () => deliveredInTimeQuantity.value.loading || deliveredWithDelayQuantity.value.loading,
)

// 'error' conterá a primeira mensagem de erro que aparecer.
const error = computed(
  () => deliveredInTimeQuantity.value.error || deliveredWithDelayQuantity.value.error,
)

const chartData = computed(() => {
  const inTimeData = deliveredInTimeQuantity.value.data
  const withDelayData = deliveredWithDelayQuantity.value.data

  // Condição de guarda: se os dados ainda não chegaram ou não são um array, retorna nulo.
  if (
    !Array.isArray(inTimeData) ||
    !inTimeData.length ||
    !Array.isArray(withDelayData) ||
    !withDelayData.length
  ) {
    return null
  }

  return {
    // Idealmente, os labels também viriam da API.
    labels: ['Maio', 'Junho', 'Julho', 'Agosto', 'Setembro'],
    datasets: [
      {
        label: 'No Prazo',
        data: inTimeData,
        backgroundColor: '#00C9FF',
        borderRadius: 6,
      },
      {
        label: 'Fora do Prazo',
        data: withDelayData,
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
        color: $q.dark.isActive ? 'white' : 'black',
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
      color: $q.dark.isActive ? '#ccc' : '#666',
      font: {
        size: 12,
        weight: 'normal',
      },
      padding: {
        bottom: 25,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: $q.dark.isActive ? 'white' : 'black' },
      grid: { color: $q.dark.isActive ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
    },
    x: {
      ticks: { color: $q.dark.isActive ? 'white' : 'black' },
      grid: { color: $q.dark.isActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
    },
  },
}))

onMounted(() => {
  store.fetchDeliveredInTimeQuantity(5)
  store.fetchDeliveredWithDelayQuantity(5)
})

watchEffect(() => {
  const ctx = chartCanvas.value?.getContext('2d')

  if (ctx && chartData.value) {
    if (chartInstance) {
      chartInstance.destroy()
    }

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: chartData.value,
      options: chartBarOptions.value,
    })
  }
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>
