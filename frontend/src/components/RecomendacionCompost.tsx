'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Leaf, Loader2, ArrowRight, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type RecomendacionProps = {
  compostId: number
}

export default function Component({ compostId }: RecomendacionProps) {
  const [recomendaciones, setRecomendaciones] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentCard, setCurrentCard] = useState(0)

  const obtenerRecomendacion = async () => {
    setLoading(true)
    setError(null)
    setRecomendaciones([])

    try {
      const response = await fetch(`http://localhost:8000/api/compost/${compostId}/procesar_datos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      })

      if (!response.ok) {
        throw new Error("Error al obtener la recomendación")
      }

      const data = await response.json()
      const formattedRecomendaciones = formatRecomendacion(data.recomendacion)
      setRecomendaciones(formattedRecomendaciones)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Error inesperado")
      }
    } finally {
      setLoading(false)
    }
  }

  const formatRecomendacion = (recomendacion: string): string[] => {
    const points = recomendacion.split(/\d+\./).filter(point => point.trim() !== "")
    return points.map(point => point.trim())
  }

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % recomendaciones.length)
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
        <CardHeader className="border-b border-green-200 dark:border-green-700">
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Leaf className="h-6 w-6" />
            Recomendaciones para el Compost
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : recomendaciones.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-white dark:bg-green-800 p-4 rounded-lg shadow-md min-h-[150px] max-h-[300px] overflow-y-auto">
                <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                  {recomendaciones[currentCard]}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <Progress value={((currentCard + 1) / recomendaciones.length) * 100} className="w-2/3" />
                <Button onClick={nextCard} size="icon" variant="outline">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Haz clic en &quot;Generar Recomendación&quot; para obtener consejos sobre tu compost.
            </p>
          )}
        </CardContent>
      </Card>
      <Button 
        onClick={obtenerRecomendacion} 
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : (
          "Generar Recomendación"
        )}
      </Button>
    </div>
  )
}
