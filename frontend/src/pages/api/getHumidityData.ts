// pages/api/getHumidityData.ts
import { NextApiRequest, NextApiResponse } from 'next';

type HumidityData = {
  created_at: string;
  field2: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const channelID = '2706807';
  const apiKey = "VVMN48PXR9T8GUHY"; 

  // Obtén el valor de "results" de la consulta, con un valor predeterminado de 8
  const results = req.query.results ? parseInt(req.query.results as string, 10) : 8;
  const url = `https://api.thingspeak.com/channels/${channelID}/fields/2.json?api_key=${apiKey}&results=${results}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data: { feeds: HumidityData[] } = await response.json();
    res.status(200).json(data.feeds);
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
}
