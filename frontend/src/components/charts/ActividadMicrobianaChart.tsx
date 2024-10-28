import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type SensorData = {
  created_at: string;
  field1: string; // Temperatura
  field2: string; // Humedad
};

const ActividadMicrobianaChart = () => {
  const [actividadData, setActividadData] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);
  const [interval, setInterval] = useState<'hour' | 'day' | 'month'>('hour');

  useEffect(() => {
    const fetchData = async () => {
      const results = interval === 'hour' ? 8 : interval === 'day' ? 300 : 800;
      const response = await fetch(`https://api.thingspeak.com/channels/2706807/feeds.json?api_key=2V1G2CJDMI0FM6RJ&results=${results}`);
      const data = await response.json();

      // Procesa los datos de actividad microbiana
      const processedData = processDataByInterval(data.feeds, interval);
      setActividadData(processedData.values);
      setTimeLabels(processedData.labels);
    };

    fetchData();
  }, [interval]);

  const calcularNivelActividadMicrobiana = (temperatura: number, humedad: number): number => {
    const temperaturaOptima = temperatura >= 40 && temperatura <= 60;
    const humedadOptima = humedad >= 50 && humedad <= 60;

    if (temperaturaOptima && humedadOptima) return 2; // Alta
    if (temperaturaOptima || humedadOptima) return 1; // Media
    return 0; // Baja
  };

  const processDataByInterval = (data: SensorData[], interval: 'hour' | 'day' | 'month') => {
    const groupedData: { [key: string]: number[] } = {};

    data.forEach((entry) => {
      const date = new Date(entry.created_at);
      let label = '';
      const temperatura = parseFloat(entry.field1);
      const humedad = parseFloat(entry.field2);
      const actividad = calcularNivelActividadMicrobiana(temperatura, humedad);

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
      groupedData[label].push(actividad);
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
        label: 'Nivel de Actividad Microbiana',
        data: actividadData,
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
          text: interval === 'hour' ? 'Hora' : interval === 'day' ? 'Día' : 'Mes',
        },
      },
      y: {
        beginAtZero: true,
        max: 2,
        title: {
          display: true,
          text: 'Nivel de Actividad (0 = Baja, 1 = Media, 2 = Alta)',
        },
      },
    },
  };

  return (
    <div>
      <h2>Nivel de Actividad Microbiana en Tiempo Real</h2>
      <select value={interval} onChange={(e) => setInterval(e.target.value as 'hour' | 'day' | 'month')}>
        <option value="hour">Por Hora</option>
        <option value="day">Por Día</option>
        <option value="month">Por Mes</option>
      </select>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ActividadMicrobianaChart;
