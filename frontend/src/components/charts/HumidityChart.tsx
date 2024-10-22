import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HumidityChart = () => {
  const [humidityData, setHumidityData] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/getHumidityData');
      const data = await response.json();
      
      const humidity = data.map((entry: { field2: string }) => parseFloat(entry.field2));
      const times = data.map((entry: { created_at: string }) => new Date(entry.created_at).toLocaleTimeString());

      setHumidityData(humidity);
      setTimeLabels(times);
    };

    fetchData();
  }, []);

  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Humedad (%)',
        data: humidityData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
        beginAtZero: true,
        title: {
          display: true,
          text: 'Humedad (%)',
        },
      },
    },
  };

  return (
    <div>
      <h2>Humedad en Tiempo Real</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HumidityChart;
