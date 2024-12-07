export default async function handler(req, res) {
  if (req.method === 'GET') {
    const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;
    const { latitude, longitude } = req.query;
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return res.status(200).json(data.features[0].properties);
      } else {
        console.error('Location not found');
      }
    } catch (error) {
      console.error('Failed to fetch location', error);
    }
  }
}
