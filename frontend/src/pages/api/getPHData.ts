import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const channelID = '2706807'
    const apiKey = "NT58FIVI1SXANGJS" 
  const url = `https://api.thingspeak.com/channels/${channelID}/fields/3.json?api_key=${apiKey}&results=8`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data.feeds);
  } catch (error) {
    res.status(500).json({ error: "Error"});
  }
}
