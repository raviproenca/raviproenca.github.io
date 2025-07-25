document.addEventListener("DOMContentLoaded", () => {
  const ctxLocatariosPie = document
    .getElementById("locatarios-chart-pie")
    .getContext("2d");

  const ctxLivrosBar = document
    .getElementById("livros-chart-bar")
    .getContext("2d");

  const orange = "#FF7F00";
  const limeGreen = "#A7ED4A";
  const purple = "#9B59B6";
  const cyan = "#4ECDC4";
  const barColor = "#4ECDC4";

  new Chart(ctxLocatariosPie, {
    type: "doughnut",
    data: {
      labels: [
        "Emprestados no prazo",
        "Disponíveis",
        "Atrasados",
        "Em Manutenção",
      ],
      datasets: [
        {
          label: "Status dos Livros",
          data: [25, 45, 15, 5],
          backgroundColor: [orange, limeGreen, purple, cyan],
          borderColor: [orange, limeGreen, purple, cyan],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              let label = context.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed !== null) {
                const total = context.dataset.data.reduce(
                  (sum, val) => sum + val,
                  0
                );
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                label += context.parsed + " (" + percentage + "%)";
              }
              return label;
            },
          },
        },
        title: {
          display: false,
        },
      },
    },
  });

  let chartInstance;

  function createChart(isMobile) {
    if (chartInstance) {
      chartInstance.destroy(); // necessário destruir antes de recriar
    }

    chartInstance = new Chart(ctxLivrosBar, {
      type: "bar",
      data: {
        labels: [
          "Resumo de 2025 até o dia de hoje",
          "Resumo de 2024",
          "Resumo de 2023",
          "Resumo de 2022",
          "Resumo de 2021",
        ],
        datasets: [
          {
            label: "Livros devolvidos dentro do prazo",
            data: [25, 30, 18, 28, 35],
            backgroundColor: (context) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return null;
              const gradient = ctx.createLinearGradient(
                chartArea.left,
                0,
                chartArea.right,
                0
              );
              gradient.addColorStop(0, "#5DE0E6");
              gradient.addColorStop(1, "#1A5A72");
              return gradient;
            },
          },
        ],
      },
      options: {
        indexAxis: isMobile ? "x" : "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
          title: { display: false },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { display: false, drawBorder: false },
            ticks: { display: false },
          },
          y: {
            grid: { display: false, drawBorder: false },
            ticks: { display: false },
            barPercentage: 1,
            categoryPercentage: 0.8,
          },
        },
      },
    });
  }

  // Detecta se a tela é "mobile"
  const mediaQuery = window.matchMedia("(max-width: 840px)");

  // Inicializa com base na tela atual
  createChart(mediaQuery.matches);

  // Observa mudanças de tamanho da tela
  mediaQuery.addEventListener("change", (e) => {
    createChart(e.matches);
  });
});
