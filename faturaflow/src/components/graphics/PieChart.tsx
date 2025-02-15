import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { title } from 'process';
import { text } from 'stream/consumers';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const data = {
  labels: ['Pagos', 'Não Pagos'],
  datasets: [
    {
      data: [300, 100],
      backgroundColor: ['#ab000b', '#0000f2'],
      hoverBackgroundColor: ['#FF4568', '#2482E5'],
      borderColor: '#fff', 
      borderWidth: 2, 
    },
  ],
};

const options = {
  responsive: true, 
  maintainAspectRatio: false, 
  plugins: {
    legend: {
      display: true, 
      position: 'bottom', 
      align: 'center', 
      labels: {
        color: '#d1d5db', 
        font: {
          family: 'Inconsolata', 
          size: 12, 
          style: 'normal', 
          lineHeight: 1.2, 
        },
        padding: 25, 
        boxWidth: 20, 
        usePointStyle: false, 
      },
    },
    tooltip: {
      enabled: true, 
      backgroundColor: 'rgba(0,0,0,0.7)', 
      titleFont: { size: 16 }, 
      bodyFont: { size: 14 }, 
      bodyColor: '#fff', 
    },
    datalabels: {
      color: '#fff', 
      anchor: 'center', 
      align: 'center',
      font: {
        weight: 'bold',
        size: 14,
      },
      formatter: (value: any) => `${value}`, 
    },
  },
};

export const InvoicePieChart: React.FC = () => {
  return (
    <div className='w-80 h-56'>
      <Pie data={data} options={options} />
    </div>
  );
};
