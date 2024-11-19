import CityHeader from '@/components/cityHeader';
import WeatherCards from '@/components/weatherCards';
import WeatherHeader from '@/components/weatherHeader';
import { useState, useEffect } from 'react';
import { Grid, GridItem, Box, Center } from '@chakra-ui/react';

export default function City() {
  const [localSelectedCity, setLocalSelectedCity] = useState({});
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    const selectedCity = JSON.parse(localStorage.getItem('selectedCity')) ?? '';
    if (selectedCity) {
      setLocalSelectedCity(selectedCity);
      const { latitude, longitude } = selectedCity;
      getWeatherData(latitude, longitude);
    }
  }, []);

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

  if (Object.keys(weatherData).length === 0) return null;

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
            <CityHeader localSelectedCity={localSelectedCity} />
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
            <WeatherHeader weatherData={weatherData} />
          </GridItem>

          <WeatherCards weatherData={weatherData} />
        </Grid>
      </Center>
    </>
  );
}
