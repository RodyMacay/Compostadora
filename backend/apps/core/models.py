# core/models.py
from django.db import models

class Compost(models.Model):
    channelId = models.IntegerField(null=False) 
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    fase_actual = models.CharField(max_length=50, blank=True, null=True)
    progreso = models.IntegerField(default=0)  

    def __str__(self):
        return self.nombre

class Recommendation(models.Model):
    compost = models.ForeignKey(Compost, on_delete=models.CASCADE, related_name="recommendations")
    fecha_generacion = models.DateTimeField(auto_now_add=True)
    resultado = models.TextField() 

    def __str__(self):
        return f"Recomendación para {self.compost.nombre} - {self.fecha_generacion}"
