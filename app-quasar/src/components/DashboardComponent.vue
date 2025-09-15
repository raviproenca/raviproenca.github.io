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
            <!-- canvas do Chart.js -->
            <div style="height: 400px">
              <canvas ref="chartCanvas" style="width: 100%; height: 100%; display: block"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useDashboardsStore } from 'src/stores/dashboard-store'
import { Chart, registerables } from 'chart.js'

// registra todos os elementos do chart.js (escala, legend, etc.)
Chart.register(...registerables)

const store = useDashboardsStore()
const { bookMoreRented } = storeToRefs(store)
const { deliveredInTimeQuantity } = storeToRefs(store)
const { deliveredWithDelayQuantity } = storeToRefs(store)
const { rentsLateQuantity } = storeToRefs(store)
const { rentsPerRenter } = storeToRefs(store)
const { rentsQuantity } = storeToRefs(store)

const $q = useQuasar()
const chartCanvas = ref(null)
let chartInstance = null

const chartData = {
  labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto'],
  datasets: [
    {
      label: 'No Prazo',
      data: deliveredInTimeQuantity,
      backgroundColor: '#00C9FF',
      borderRadius: 6,
    },
    {
      label: 'Fora do Prazo',
      data: deliveredWithDelayQuantity,
      backgroundColor: '#FF7F00',
      borderRadius: 6,
    },
  ],
}

const chartOptions = computed(() => ({
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
      text: `Total devolvidos no prazo: ${totalDentroPrazo}    |    Devolvidos com atraso: ${totalForaPrazo}`,
      color: '#fff',
      font: {
        size: 12,
        weight: 700,
      },
      padding: {
        bottom: 25,
      },
    },
    datalabels: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: $q.dark.isActive ? 'white' : 'black',
      },
      grid: {
        color: $q.dark.isActive ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      },
    },
    x: {
      ticks: {
        color: $q.dark.isActive ? 'white' : 'black',
      },
      grid: {
        color: $q.dark.isActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      },
    },
  },
}))

onMounted(() => {
  store.fetchBookMoreRented()
  store.fetchDeliveredInTimeQuantity()
  store.fetchDeliveredWithDelayQuantity()
  store.fetchRentsLateQuantity()
  store.fetchRentsPerRenter()
  store.fetchRentsQuantity()

  const ctx = chartCanvas.value?.getContext('2d')
  if (!ctx) {
    console.error('Canvas do chart não encontrado (chartCanvas está nulo).')
    return
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: chartOptions.value,
  })
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>
