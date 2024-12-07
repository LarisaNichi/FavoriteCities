export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      //   const response = await fetch('https://ipinfo.io/json');
      const response = await fetch('https://api.techniknews.net/ipgeo/');
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Failed to fetch location', error);
      return res.status(404).json({ message: 'Failed to fetch location' });
    }
  }
}
