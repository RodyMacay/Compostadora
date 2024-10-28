// pages/index.tsx
import ActividadMicrobianaChart from "@/components/charts/ActividadMicrobianaChart";
import Bubble from "@/components/charts/Bubble";
import HumidityChart from "@/components/charts/HumidityChart";
import TemperatureChart from "@/components/charts/TemperatureChart";
import RecomendacionCompost from "@/components/RecomendacionCompost";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Droplets, Thermometer } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("charts")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <Card className="w-full max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-b from-green-600 to-white  p-6">
          <CardTitle className="text-2xl font-bold">Dashboard del Compostador Automático</CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-gradient-to-b from-blue-100 to-white">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 bg-gradient-to-b from-blue-100 to-white">
            <TabsList className="grid w-full grid-cols-2 ">
              <TabsTrigger value="charts">Gráficos en Tiempo Real</TabsTrigger>
              <TabsTrigger value="bubbles">Burbujas Medioambientales</TabsTrigger>
            </TabsList>
            <TabsContent value="charts" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-green-700">
                      <Droplets className="w-5 h-5 mr-2" />
                      Humedad
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HumidityChart />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-orange-700">
                      <Thermometer className="w-5 h-5 mr-2" />
                      Temperatura
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TemperatureChart />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-orange-700">
                      <Thermometer className="w-5 h-5 mr-2" />
                      Actividad Microbiana
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ActividadMicrobianaChart />
                  </CardContent>
                </Card>
                
              </div>
            </TabsContent>
            <TabsContent value="bubbles">
              <Card>
                <CardContent>
                  <Bubble />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <RecomendacionCompost compostId={1} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}