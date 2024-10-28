from django.urls import path
from .views import ProcesarDatosView

urlpatterns = [
    path('compost/<int:compost_id>/procesar_datos/', ProcesarDatosView.as_view(), name="procesar_datos"),
]
