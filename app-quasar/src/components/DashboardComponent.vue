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
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
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

const isLoading = ref(true)
const error = ref(null)

const finalInTimeData = ref([])
const finalWithDelayData = ref([])
const totalInTime = ref(0)
const totalWithDelay = ref(0)

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
      text: `Total no prazo (últimos 5 meses): ${totalInTime.value} | Total com atraso: ${totalWithDelay.value}`,
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

onMounted(async () => {
  // Função auxiliar para buscar e processar dados CUMULATIVOS
  const processCumulativeData = async (fetchFunction, stateRef) => {
    const cumulativeResults = []
    // Faz 5 chamadas sequenciais à API, de 1 a 5 meses
    for (let month = 1; month <= 5; month++) {
      await store[fetchFunction](month)
      // Após cada chamada, o 'stateRef' da store é atualizado. Guardamos esse valor.
      cumulativeResults.push(stateRef.value.data)
    }

    // Agora, calcula o valor individual de cada mês
    const monthlyData = [
      cumulativeResults[0], // O primeiro mês é o valor base
      cumulativeResults[1] - cumulativeResults[0],
      cumulativeResults[2] - cumulativeResults[1],
      cumulativeResults[3] - cumulativeResults[2],
      cumulativeResults[4] - cumulativeResults[3],
    ]

    // Retorna os dados mensais e o total (que é o último valor cumulativo)
    return { monthlyData, total: cumulativeResults[4] }
  }

  try {
    isLoading.value = true

    const inTimeResult = await processCumulativeData(
      'fetchDeliveredInTimeQuantity',
      deliveredInTimeQuantity,
    )
    const withDelayResult = await processCumulativeData(
      'fetchDeliveredWithDelayQuantity',
      deliveredWithDelayQuantity,
    )

    finalInTimeData.value = inTimeResult.monthlyData
    totalInTime.value = inTimeResult.total

    finalWithDelayData.value = withDelayResult.monthlyData
    totalWithDelay.value = withDelayResult.total

    const ctx = chartCanvas.value.getContext('2d')
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Maio', 'Junho', 'Julho', 'Agosto', 'Setembro'], // Ajuste os meses conforme necessário
        datasets: [
          {
            label: 'No Prazo',
            data: finalInTimeData.value,
            backgroundColor: '#00C9FF',
            borderRadius: 6,
          },
          {
            label: 'Fora do Prazo',
            data: finalWithDelayData.value,
            backgroundColor: '#FF7F00',
            borderRadius: 6,
          },
        ],
      },
      options: chartBarOptions.value,
    })
  } catch (err) {
    console.error('Erro ao buscar dados para o gráfico:', err)
    error.value = 'Não foi possível carregar os dados do gráfico.'
  } finally {
    isLoading.value = false
  }
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>
