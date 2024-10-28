export const fetchSensorData = async (): Promise<{ temperatura: number; humedad: number }> => {
    const apiUrl = 'https://api.thingspeak.com/channels/2706807/feeds.json';
    try {
      const response = await fetch(`${apiUrl}?api_key=2V1G2CJDMI0FM6RJ&results=1`);
      const data = await response.json();
  
      // Obtener la última lectura de temperatura y humedad
      const ultimaLectura = data.feeds[data.feeds.length - 1];
      const temperatura = ultimaLectura.field1 ? parseFloat(ultimaLectura.field1) : 0;
      const humedad = ultimaLectura.field2 ? parseFloat(ultimaLectura.field2) : 0;
  
      return { temperatura, humedad };
    } catch (error) {
      console.error("Error al obtener los datos de ThingSpeak:", error);
      throw error;
    }
  };