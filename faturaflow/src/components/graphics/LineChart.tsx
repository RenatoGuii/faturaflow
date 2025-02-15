import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar os elementos necessários para o gráfico de linha
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Eixo X
  datasets: [
    {
      label: 'Vendas 2025', // Nome da série
      data: [65, 59, 80, 81, 56, 55], // Valores das vendas
      fill: false, // Não preenche a área abaixo da linha
      borderColor: '#FF5733', // Cor da linha
      tension: 0.1, // Curvatura da linha
      pointBackgroundColor: '#FF5733', // Cor dos pontos
      pointBorderColor: '#fff', // Cor da borda dos pontos
      pointBorderWidth: 2, // Largura da borda dos pontos
      pointRadius: 5, // Tamanho dos pontos
      borderWidth: 3, // Largura da linha
      hoverBackgroundColor: '#FF5733', // Cor ao passar o mouse
    },
    {
      label: 'Vendas 2024', // Nome da outra série
      data: [28, 48, 40, 19, 86, 27],
      fill: false,
      borderColor: '#33FF57',
      tension: 0.1,
      pointBackgroundColor: '#33FF57',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      borderWidth: 3,
      hoverBackgroundColor: '#33FF57',
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false, // Permite controlar a altura e largura manualmente
  plugins: {
    tooltip: {
      enabled: true, // Exibe tooltips
      backgroundColor: 'rgba(0,0,0,0.7)', // Cor do fundo da tooltip
      titleFont: { size: 16 }, // Tamanho da fonte do título da tooltip
      bodyFont: { size: 14 }, // Tamanho da fonte do corpo da tooltip
      bodyColor: '#fff', // Cor do texto na tooltip
    },
    legend: {
      display: true, // Exibe a legenda
      position: 'top', // Posição da legenda
      labels: {
        font: {
          size: 14, // Tamanho da fonte da legenda
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true, // Exibe o título do eixo X
        text: 'Meses',
        font: {
          size: 16,
        },
      },
    },
    y: {
      title: {
        display: true, // Exibe o título do eixo Y
        text: 'Vendas',
        font: {
          size: 16,
        },
      },
      ticks: {
        beginAtZero: true, // Inicia o gráfico a partir de 0
      },
    },
  },
};

export const InvoiceLineChart: React.FC = () => {
  return (
    <div className='w-full h-full'>
      <Line data={data} options={options} />
    </div>
  );
};

