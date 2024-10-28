import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type TemperatureData = {
  created_at: string;
  field1: string;
};

const TemperatureChart = () => {
  const [temperatureData, setTemperatureData] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);
  const [interval, setInterval] = useState<'hour' | 'day' | 'month'>('hour');

  useEffect(() => {
    const fetchData = async () => {
      // Define el número de resultados en función del intervalo seleccionado
      const results = interval === 'hour' ? 8 : interval === 'day' ? 300 : 800;
      const response = await fetch(`/api/getTemperatureData?results=${results}`);
      const data: TemperatureData[] = await response.json();

      // Procesa los datos en función del intervalo seleccionado
      const processedData = processDataByInterval(data, interval);
      setTemperatureData(processedData.values);
      setTimeLabels(processedData.labels);
    };

    fetchData();
  }, [interval]);

  const processDataByInterval = (data: TemperatureData[], interval: 'hour' | 'day' | 'month') => {
    const groupedData: { [key: string]: number[] } = {};

    data.forEach((entry) => {
      const date = new Date(entry.created_at);
      let label = '';

      // Agrupa los datos según el intervalo
      if (interval === 'hour') {
        label = date.toLocaleTimeString();
      } else if (interval === 'day') {
        label = date.toLocaleDateString();
      } else if (interval === 'month') {
        label = `${date.getFullYear()}-${date.getMonth() + 1}`;
      }

      if (!groupedData[label]) {
        groupedData[label] = [];
      }
      groupedData[label].push(parseFloat(entry.field1));
    });

    // Calcula el promedio de los valores agrupados
    const labels = Object.keys(groupedData);
    const values = labels.map((label) => {
      const sum = groupedData[label].reduce((a, b) => a + b, 0);
      return sum / groupedData[label].length;
    });

    return { labels, values };
  };

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
          text: interval === 'hour' ? 'Hora' : interval === 'day' ? 'Día' : 'Mes',
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
      <select value={interval} onChange={(e) => setInterval(e.target.value as 'hour' | 'day' | 'month')}>
        <option value="hour">Por Hora</option>
        <option value="day">Por Día</option>
        <option value="month">Por Mes</option>
      </select>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TemperatureChart;