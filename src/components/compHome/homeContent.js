import HomeCitiesContent from './homeCitiesContent';
import HomeMainContent from './homeMainContent';
import HomeLayout from './homeLayout';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';

export default function HomeContent({ randomFavoriteCities, randomCities }) {
  const { data: session } = useSession();
  const [location, setLocation] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getGeolocation();
  }, []);

  async function getGeolocation() {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      geolocationPositionCb,
      geolocationPositionErrorCb
    );
  }

  const geolocationPositionCb = async (position) => {
    const { latitude, longitude } = position.coords;
    setLocation({ latitude, longitude });
    await getLocationOnPosition(latitude, longitude);
  };

  const geolocationPositionErrorCb = async () => {
    const response = await fetch('/api/ip');
    const result = await response.json();
    const { country, city, lat: latitude, lon: longitude } = result;
    setLoading(false);
    setLocation({ city, country, latitude, longitude });
  };

  const getLocationOnPosition = async (latitude, longitude) => {
    const query = new URLSearchParams({ latitude, longitude }).toString();
    const response = await fetch(`/api/geoapify?${query}`);
    const result = await response.json();
    const { city, country } = result;
    setLoading(false);
    setLocation((prevState) => ({
      ...prevState,
      city,
      country,
    }));
  };

  return (
    <>
      <HomeLayout>
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(10, 1fr)' }}
          gap="6"
          height="100%"
          alignItems="center"
        >
          <GridItem colSpan={{ base: '1', sm: '3' }}>
            {session && (
              <HomeCitiesContent
                cities={randomFavoriteCities}
              ></HomeCitiesContent>
            )}
            {!session && (
              <HomeCitiesContent cities={randomCities}></HomeCitiesContent>
            )}
          </GridItem>
          <GridItem colSpan={{ base: '1', sm: '4' }} alignSelf="center">
            <HomeMainContent
              location={location}
              loading={loading}
            ></HomeMainContent>
          </GridItem>
          <GridItem colSpan={{ base: '1', sm: '3' }} gap="4">
            <HomeCitiesContent cities={randomCities}></HomeCitiesContent>
          </GridItem>
        </Grid>
      </HomeLayout>
    </>
  );
}
