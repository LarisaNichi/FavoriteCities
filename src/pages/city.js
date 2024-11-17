import CityHeader from '@/components/cityHeader';
import TextWeatherContent from '@/components/textWeatherContent';
import TextWeatherHeader from '@/components/textWeatherHeader';
import GridWeatherCard from '@/components/gridWeatherCard';
import { useState, useEffect } from 'react';
import { TiWeatherWindy } from 'react-icons/ti';
import { FaDroplet } from 'react-icons/fa6';
import { LiaStarSolid } from 'react-icons/lia';
import {
  Grid,
  GridItem,
  Box,
  Center,
  Text,
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react';

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
        )}&longitude=${String(
          longitude
        )}&current=temperature_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_hours=1`
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

  if (
    Object.keys(localSelectedCity).length === 0 ||
    Object.keys(weatherData).length === 0
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
            <HStack justifyContent="space-between" pt="4" pb="2">
              <Button
                colorPalette="blue"
                variant="surface"
                px="4"
                fontSize="md"
                fontWeight="semibold"
              >
                <LiaStarSolid /> Add to favorites
              </Button>
              <Center gap="2">
                <VStack>
                  <TextWeatherContent
                    weatherData={weatherData.current.temperature_2m}
                    weatherDataUnits={weatherData.current_units.temperature_2m}
                    textStyle="4xl"
                    fontWeight="bold"
                    color="blue.600"
                  />
                  <HStack
                    fontWeight="semibold"
                    textAlign="center"
                    color="blue.800"
                    pr="4"
                  >
                    <TextWeatherContent
                      weatherData={weatherData.current.wind_speed_10m}
                      weatherDataUnits={
                        weatherData.current_units.wind_speed_10m
                      }
                      textStyle="lg"
                    />
                    <Text textStyle="lg">
                      |&nbsp;
                      {`${new Date(
                        weatherData.current.time
                      ).getHours()}`.padStart(2, 0)}
                      :
                      {`${new Date(
                        weatherData.current.time
                      ).getMinutes()}`.padStart(2, 0)}
                    </Text>
                  </HStack>
                </VStack>
              </Center>
            </HStack>
          </GridItem>

          {weatherData.daily.time.map((day, index) => (
            <GridWeatherCard index={index} key={day}>
              <TextWeatherHeader day={day} index={index} />
              <TextWeatherContent
                weatherData={weatherData.daily.temperature_2m_max[index]}
                weatherDataUnits={weatherData.daily_units.temperature_2m_max}
                bg="yellow.400"
                p={1}
                rounded="sm"
                mx="auto"
              />
              <TextWeatherContent
                weatherData={weatherData.daily.temperature_2m_min[index]}
                weatherDataUnits={weatherData.daily_units.temperature_2m_min}
                bg="green.300"
                p={1}
                rounded="sm"
                mx="auto"
              />
              <HStack mx="auto" gap="1">
                <TiWeatherWindy />
                <TextWeatherContent
                  weatherData={weatherData.daily.wind_speed_10m_max[index]}
                  weatherDataUnits={weatherData.daily_units.wind_speed_10m_max}
                />
              </HStack>
              <HStack mx="auto" gap="1">
                <FaDroplet />
                <TextWeatherContent
                  weatherData={
                    weatherData.daily.precipitation_probability_max[index]
                  }
                  weatherDataUnits={
                    weatherData.daily_units.precipitation_probability_max
                  }
                />
              </HStack>
            </GridWeatherCard>
          ))}
        </Grid>
      </Center>
    </>
  );
}
