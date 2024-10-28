import openai
import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Compost, Recommendation
from .utils import determinar_fase

class ProcesarDatosView(APIView):
    def post(self, request, compost_id):
        try:
            # URL de ThingSpeak para obtener los datos del canal
            api_url = "https://api.thingspeak.com/channels/2706807/feeds.json"
            headers = {
                "Content-Type": "application/json",
            }
            params = {
                "api_key": settings.SPEAKTHINKS_API_KEY,
                "results": 1  # Obtener solo la última lectura
            }

            sensor_response = requests.get(api_url, headers=headers, params=params)
            print("Holaaa", sensor_response)

            if not sensor_response.ok:
                return Response({"error": "No se pudieron obtener los datos de sensores de ThingSpeak"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            sensor_data = sensor_response.json()
            print(sensor_data)
            ultima_lectura = sensor_data['feeds'][-1]

            # Verificar y convertir cada valor
            temperatura = float(ultima_lectura['field1']) if ultima_lectura['field1'] is not None else 0.0
            humedad = float(ultima_lectura['field2']) if ultima_lectura['field2'] is not None else 0.0
            co2 = float(ultima_lectura['field3']) if ultima_lectura['field3'] is not None else 0.0

            print("AQUIII ESTOY",temperatura, humedad, co2)

            # Determina la fase actual del compost
            fase_actual = determinar_fase(temperatura, humedad, co2)

            # Genera un prompt para OpenAI y obtiene la recomendación
            prompt = f"""
            Analiza los siguientes datos de compostaje y proporciona recomendaciones detalladas para optimizar el proceso:

                Datos actuales:
                - Fase: {fase_actual}
                - Temperatura: {temperatura}°C
                - Humedad: {humedad}%
                - CO2: {co2} ppm

                Basándote en estos datos:
                1. Evalúa si cada parámetro está dentro del rango óptimo para la fase actual.
                2. Proporciona recomendaciones específicas para ajustar cada parámetro si es necesario.
                3. Sugiere acciones concretas que el usuario pueda realizar para mejorar el proceso de compostaje.
                4. Si todos los parámetros son óptimos, proporciona consejos para mantener estas condiciones.

                Formato de respuesta:
                - Inicia con un resumen general del estado del compost.
                - Luego, proporciona recomendaciones numeradas y concisas.
                - Concluye con un consejo general para el mantenimiento a largo plazo.

                    Asegúrate de que las recomendaciones sean prácticas, fáciles de entender y aplicar por usuarios no expertos.
                """

            # Configuración de Azure OpenAI
            openai.api_type = "azure"
            openai.api_key = settings.AZURE_OPENAI_KEY
            openai.api_base = settings.AZURE_OPENAI_ENDPOINT
            openai.api_version = "2023-03-15-preview"

            # Solicitud a Azure OpenAI
            response = openai.ChatCompletion.create(
            engine="gpt-35-turbo",
            messages=[
                {"role": "system", "content": "Eres un experto en compostaje."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500
        )

            resultado = response.choices[0].message['content']
            print(resultado)
            recomendacion = Recommendation.objects.create(compost_id=compost_id, resultado=resultado)

            return Response({
                "fase_actual": fase_actual,
                "recomendacion": resultado
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)