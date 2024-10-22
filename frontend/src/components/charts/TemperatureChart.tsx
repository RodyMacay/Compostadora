import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TemperatureChart = () => {
  const [temperatureData, setTemperatureData] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/getTemperatureData');
      const data = await response.json();
      
      const temperatures = data.map((entry: { field1: string }) => parseFloat(entry.field1));
      const times = data.map((entry: { created_at: string }) => new Date(entry.created_at).toLocaleTimeString());

      setTemperatureData(temperatures);
      setTimeLabels(times);
    };

    fetchData();
  }, []);

  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: temperatureData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
          text: 'Temperatura (°C)',
        },
      },
    },
  };

  return (
    <div>
      <h2>Temperatura en Tiempo Real</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TemperatureChart;
