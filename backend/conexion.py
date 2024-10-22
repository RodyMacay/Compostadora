import serial
import requests
import time

# Configuración del puerto serial (ajusta 'COM3' al puerto donde esté tu Arduino)
serial_port = 'COM3'  # o '/dev/ttyUSB0' en Linux
baud_rate = 9600
ser = serial.Serial(serial_port, baud_rate)

# Tu clave de escritura de ThingSpeak y el ID del canal
api_key = 'TU_API_KEY'
channel_id = 'TU_CHANNEL_ID'

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
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').rstrip()
            print("Datos recibidos:", line)
            
            # Extraer valores de temperatura y humedad de la línea
            if "Temperatura" in line and "Humedad" in line:
                parts = line.split(", ")
                temp = parts[0].split(": ")[1].replace(" *C", "")
                hum = parts[1].split(": ")[1].replace(" %", "")
                
                # Enviar los datos a ThingSpeak
                send_to_thingspeak(temp, hum)
                
        time.sleep(15)  # Esperar 15 segundos para cumplir con los límites de ThingSpeak
    except KeyboardInterrupt:
        print("Interrumpido por el usuario")
        break
    except Exception as e:
        print("Error:", e)
        break