def determinar_fase(temperatura, humedad, co2):
    if 50 <= temperatura <= 70 and 50 <= humedad <= 60 and co2 >= 5:
        return "Termófila (Fermentación)"
    elif temperatura < 45 and humedad >= 50 and co2 < 5:
        return "Mesófila (Pre-Fermentación)"
    elif 20 <= temperatura < 45 and 40 <= humedad < 50 and co2 <= 2:
        return "Enfriamiento"
    elif temperatura <= 20 and humedad <= 30 and co2 < 1:
        return "Maduración"
    return "Desconocido"