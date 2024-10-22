import Bubble from "@/components/charts/Bubble";
import HumidityChart from "@/components/charts/HumidityChart";
import PHChart from "@/components/charts/PHChart";
import TemperatureChart from "@/components/charts/TemperatureChart";


export default function Home() {
  return (
    <div>
    <HumidityChart />
      <TemperatureChart />
      
      <PHChart />
      <Bubble/>


    </div>
  );
}
