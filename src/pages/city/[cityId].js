import CityHeader from '@/components/cityHeader';
import WeatherCards from '@/components/weatherCards';
import WeatherHeader from '@/components/weatherHeader';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Grid, GridItem, Box, Center, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function ShowCity() {
  const [selectedCity, setSelectedCity] = useState({});
  const [weatherData, setWeatherData] = useState({});
  const [cityIsSavedToFavorites, setCityIsSavedToFavorites] = useState();
  const router = useRouter();
  const { cityId, country, id, latitude, longitude } = router.query;
  const { data: session } = useSession();

  useEffect(() => {
    if (router.isReady) {
      getCityData();
      getWeatherData(latitude, longitude);
    }
  }, [router.isReady, latitude, longitude]);

  async function getCityData() {
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/get?id=${id}`
      );
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const city = await res.json();
      setSelectedCity(city);
    } catch (err) {
      console.log(err);
    }
  }

  async function getWeatherData(latitude, longitude) {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${String(
          latitude
        )}&longitude=${longitude}&current=temperature_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_hours=1`
      );
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const weatherData = await res.json();
      setWeatherData(weatherData);
    } catch (err) {
      console.log(err);
    }
  }

  async function addToFavorites() {
    try {
      const response = await fetch('/api/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cityToSave: {
            id,
            name: decodeURI(cityId),
            country,
            latitude,
            longitude,
          },
          email: session.user.email,
        }),
      });
      const result = await response.json();
      setCityIsSavedToFavorites(result);
      // console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteCityFromFavorites() {
    try {
      const response = await fetch('/api/cities', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, email: session.user.email }),
      });
      const result = await response.json();
      setCityIsSavedToFavorites(result);
      // console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  if (
    Object.keys(weatherData).length === 0 ||
    Object.keys(selectedCity).length === 0
  )
    return null;

  return (
    <>
      <Center my="4">
        <Grid
          h="93vh"
          w={{
            base: '95%',
            lg: '85%',
            xl: '70%',
          }}
          templateColumns="repeat(16, 1fr)"
          templateRows="repeat(9, 1fr)"
          justifyContent="center"
          alignContent="center"
        >
          <GridItem gridRow="1/2" gridColumn="1/-1">
            <CityHeader selectedCity={selectedCity} />
          </GridItem>

          <GridItem
            gridRow={{
              base: '2/-1',
              md: '2/5',
            }}
            gridColumn="1/-1"
          >
            <Box h="100%" bg="blue.300" py="1"></Box>
          </GridItem>

          <GridItem gridRow="2/3" gridColumn="2/-2">
            <WeatherHeader
              weatherData={weatherData}
              addToFavorites={addToFavorites}
              deleteCityFromFavorites={deleteCityFromFavorites}
              cityIsSavedToFavorites={cityIsSavedToFavorites}
            />
          </GridItem>

          <WeatherCards weatherData={weatherData} />
        </Grid>
      </Center>
    </>
  );
}
