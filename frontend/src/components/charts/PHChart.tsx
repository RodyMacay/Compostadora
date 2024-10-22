import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PHChart = () => {
  const [phData, setPHData] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/getPHData');
      const data = await response.json();
      
      const phValues = data.map((entry: { field3: string }) => parseFloat(entry.field3));
      const times = data.map((entry: { created_at: string }) => new Date(entry.created_at).toLocaleTimeString());

      setPHData(phValues);
      setTimeLabels(times);
    };

    fetchData();
  }, []);

  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'pH',
        data: phData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hora',
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'pH',
        },
      },
    },
  };

  return (
    <div>
      <h2>pH en Tiempo Real</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PHChart;
