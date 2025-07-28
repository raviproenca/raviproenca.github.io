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

  const dentroPrazo = [25, 30, 18, 28, 35];
  const foraPrazo = [5, 7, 4, 6, 3];

  const mediaQuery = window.matchMedia("(max-width: 480px)");
  const isMobile = mediaQuery.matches;
  const dynamicFontSize = isMobile ? 11 : 14;
  const dynamicPadding = isMobile ? 10 : 20;

  // === DOUGHNUT CHART ===
  new Chart(ctxLocatariosPie, {
    type: "doughnut",
    data: {
      labels: [
        "Livros alugados",
        "Aluguéis realizados",
        "Livros devolvidos no prazo",
        "Livros devolvidos com atraso",
      ],
      datasets: [
        {
          label: "Status dos Livros",
          data: [37, 29, 58, 11],
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
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1200,
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#fff",
            font: {
              size: dynamicFontSize,
              weight: 700,
            },
            padding: dynamicPadding,
            boxWidth: 14,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              let label = context.label || "";
              if (label) label += ": ";
              if (context.parsed !== null) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
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

  // === BAR CHART COMPARATIVO ===
  let chartInstance;

  function createChart(isMobile) {
    if (chartInstance) chartInstance.destroy();

    const fontSize = isMobile ? 10 : 14;
    const titleFontSize = isMobile ? 12 : 16;
    const paddingMobile = isMobile ? 25 : 15;
    const totalDentro = dentroPrazo.reduce((a, b) => a + b, 0);
    const totalFora = foraPrazo.reduce((a, b) => a + b, 0);

    chartInstance = new Chart(ctxLivrosBar, {
      type: "bar",
      data: {
        labels: ["2025", "2024", "2023", "2022", "2021"],
        datasets: [
          {
            label: "No Prazo",
            data: dentroPrazo,
            backgroundColor: "#00C9FF",
            borderRadius: 6,
          },
          {
            label: "Fora do Prazo",
            data: foraPrazo,
            backgroundColor: "#FF7F00",
            borderRadius: 6,
          },
        ],
      },
      options: {
        indexAxis: isMobile ? "x" : "y",
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              color: "#fff",
              boxWidth: 12,
              padding: 15,
              font: {
                size: fontSize,
                weight: 700,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed}`,
            },
          },
          subtitle: {
            display: true,
            text: `Livros devolvidos no prazo: ${totalDentro}    |    Devolvidos com atraso: ${totalFora}`,
            color: "#fff",
            font: {
              size: titleFontSize,
              weight: 700,
            },
            padding: {
              bottom: paddingMobile,
            },
          },
          datalabels: {
            display: false,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              color: "#fff",
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              color: "#fff",
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  createChart(isMobile);
  mediaQuery.addEventListener("change", (e) => {
    createChart(e.matches);
    location.reload();
  });

  const toggleNav = document.getElementById("toggle-nav");
  const nav = document.getElementById("navbar");
  toggleNav.addEventListener("click", (e) => {
    e.stopPropagation(); // impede propagação para o documento
    nav.classList.toggle("active");
  });

  // Fecha navbar ao clicar fora
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("active") && !nav.contains(e.target)) {
      nav.classList.remove("active");
    }
  });

  const profileButton = document.getElementById("profile-button");
  const profileModal = document.getElementById("profile-modal");

  profileButton.addEventListener("click", () => {
    profileModal.classList.toggle("visible");
  });

  document.addEventListener("click", (e) => {
    if (!profileButton.contains(e.target) && !profileModal.contains(e.target)) {
      profileModal.classList.remove("visible");
    }
  });
});
