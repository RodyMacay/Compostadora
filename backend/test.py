import requests
import time
import random

# Tu clave de escritura de ThingSpeak y el ID del canal
api_key = '2706807' 
channel_id = 'NT58FIVI1SXANGJS'  

def send_to_thingspeak(temperature, humidity):
    url = f"https://api.thingspeak.com/update?api_key={api_key}&field1={temperature}&field2={humidity}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("Datos enviados a ThingSpeak correctamente")
        else:
            print("Error al enviar datos a ThingSpeak:", response.status_code)
    except Exception as e:
        print("Excepción al conectar con ThingSpeak:", e)

while True:
    try:
        # Generar datos aleatorios de temperatura y humedad
        simulated_temperature = round(random.uniform(20.0, 35.0), 2)  # Temperatura simulada entre 20 y 35 grados Celsius
        simulated_humidity = round(random.uniform(30.0, 80.0), 2)  # Humedad simulada entre 30% y 80%

        print(f"Simulación - Temperatura: {simulated_temperature} *C, Humedad: {simulated_humidity} %")
        
        # Enviar los datos simulados a ThingSpeak
        send_to_thingspeak(simulated_temperature, simulated_humidity)
        
        time.sleep(15)  # Esperar 15 segundos para cumplir con los límites de ThingSpeak
    except KeyboardInterrupt:
        print("Interrumpido por el usuario")
        break
    except Exception as e:
        print("Error:", e)
        break
