import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const channelID = '2706807';
  const apiKey = "VVMN48PXR9T8GUHY";

  // Obtén el valor de "results" de la consulta; usa 8 como valor predeterminado si no se proporciona
  const results = req.query.results || 8;
  
  const url = `https://api.thingspeak.com/channels/${channelID}/fields/1.json?api_key=${apiKey}&results=${results}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data.feeds);
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
}
