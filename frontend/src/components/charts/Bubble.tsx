"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets } from 'lucide-react'; 

interface PuntoData {
  label: string;
  value: number;
  unit: string;
  minValue: number;
  maxValue: number;
  criticalValue: number;
  icon: React.ReactNode;
}

export default function Componente() {
  const [data, setData] = useState<PuntoData[]>([
    { label: 'Temperatura', value: 0, unit: '°C', minValue: 15, maxValue: 35, criticalValue: 30, icon: <Thermometer className="w-6 h-6" /> },
    { label: 'Humedad', value: 0, unit: '%', minValue: 30, maxValue: 70, criticalValue: 65, icon: <Droplets className="w-6 h-6" /> },
    { label: 'Actividad Microbiana', value: 0, unit: '', minValue: 0, maxValue: 2, criticalValue: 1.5, icon: <Droplets className="w-6 h-6" /> },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.thingspeak.com/channels/2706807/feeds.json?api_key=2V1G2CJDMI0FM6RJ&results=1');
      const sensorData = await response.json();
      const ultimaLectura = sensorData.feeds[sensorData.feeds.length - 1];

      const temperatura = ultimaLectura.field1 ? parseFloat(ultimaLectura.field1) : 0;
      const humedad = ultimaLectura.field2 ? parseFloat(ultimaLectura.field2) : 0;

      // Calcular nivel de actividad microbiana basado en temperatura y humedad
      const actividadMicrobiana = calcularNivelActividadMicrobiana(temperatura, humedad);

      setData((prevData) => [
        { ...prevData[0], value: temperatura },
        { ...prevData[1], value: humedad },
        { ...prevData[2], value: actividadMicrobiana },
      ]);
    } catch (error) {
      console.error("Error al obtener los datos de ThingSpeak:", error);
    }
  };

  const calcularNivelActividadMicrobiana = (temperatura: number, humedad: number): number => {
    const temperaturaOptima = temperatura >= 40 && temperatura <= 60;
    const humedadOptima = humedad >= 50 && humedad <= 60;

    if (temperaturaOptima && humedadOptima) return 2; // Alta
    if (temperaturaOptima || humedadOptima) return 1; // Media
    return 0; // Baja
  };

  useEffect(() => {
    const actualizarTamaño = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    actualizarTamaño();
    window.addEventListener('resize', actualizarTamaño);

    const intervalo = setInterval(fetchData, 15000);

    fetchData();

    return () => {
      clearInterval(intervalo);
      window.removeEventListener('resize', actualizarTamaño);
    };
  }, []);

  const obtenerColor = (value: number, criticalValue: number, maxValue: number) => {
    if (value >= criticalValue) return 'rgba(255, 65, 54, 0.7)';
    if (value >= maxValue * 0.8) return 'rgba(255, 220, 0, 0.7)';
    return 'rgba(46, 204, 64, 0.7)';
  };

  const obtenerTamaño = (value: number, criticalValue: number, maxValue: number) => {
    const tamañoBase = 150;
    if (value >= criticalValue) return tamañoBase * 1.5;
    if (value >= maxValue * 0.8) return tamañoBase * 1.25;
    return tamañoBase;
  };

  const generarPosiciónAleatoria = (tamaño: number) => {
    const margen = tamaño / 2 + 20;
    return {
      x: Math.random() * (containerSize.width - 2 * margen) + margen,
      y: Math.random() * (containerSize.height - 2 * margen) + margen,
    };
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          <h1 className="text-xl font-bold">Monitorización de Compostador Automático</h1>
        </div>
        <h2 className="text-lg font-semibold mb-4">BURBUJAS MEDIOAMBIENTALES</h2>
        <div className="border-2 border-gray-700 rounded-lg p-4">
          <div ref={containerRef} className="relative h-[500px] w-full overflow-hidden">
            {data.map((item, index) => {
              const tamaño = obtenerTamaño(item.value, item.criticalValue, item.maxValue);
              const color = obtenerColor(item.value, item.criticalValue, item.maxValue);
              const actividadLabel = item.label === "Actividad Microbiana"
                ? item.value === 2 ? "Alta" : item.value === 1 ? "Media" : "Baja"
                : item.value.toFixed(2);

              return (
                <motion.div
                  key={index}
                  className="absolute cursor-pointer"
                  style={{
                    width: tamaño,
                    height: tamaño,
                  }}
                  initial={generarPosiciónAleatoria(tamaño)}
                  animate={generarPosiciónAleatoria(tamaño)}
                  transition={{
                    duration: Math.random() * 10 + 5,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full flex flex-col items-center justify-center text-center overflow-hidden p-2"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${color}, rgba(0, 0, 0, 0.5))`,
                      boxShadow: `0 0 20px ${color}, inset 0 0 20px ${color}`,
                      border: `2px solid rgba(255, 255, 255, 0.2)`,
                    }}
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  >
                    <div className="mb-2">{item.icon}</div>
                    <div className="text-sm font-bold leading-tight text-white">{item.label}</div>
                    <div className="text-lg font-bold leading-tight text-white">
                      {actividadLabel}
                      <span className="text-xs ml-1 text-gray-200">{item.unit}</span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
