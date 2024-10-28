# core/serializers.py
from rest_framework import serializers
from ..models import Compost, Recommendation

class CompostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compost
        fields = ['id', 'nombre', 'descripcion', 'fecha_inicio', 'fase_actual', 'progreso']

class RecommendationSerializer(serializers.ModelSerializer):
    compost = CompostSerializer(read_only=True)
    
    class Meta:
        model = Recommendation
        fields = ['compost', 'fecha_generacion', 'resultado']
