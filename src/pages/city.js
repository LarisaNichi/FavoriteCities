import Navigation from '@/components/navigation';
import { Heading } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  Grid,
  GridItem,
  Box,
  Center,
  Text,
  Flex,
  FormatNumber,
  Image,
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react';
import { FaPeopleGroup } from 'react-icons/fa6';
import { TbWorldLatitude } from 'react-icons/tb';
import { TbWorldLongitude } from 'react-icons/tb';
import { TiWeatherWindy } from 'react-icons/ti';
import { FaDroplet } from 'react-icons/fa6';
import { LiaStarSolid } from 'react-icons/lia';

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
  const { name, country, latitude, longitude, population, country_code, id } =
    localSelectedCity;

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  console.log(weatherData);

  return (
    <>
      <Navigation />

      <Center my={10}>
        <Grid
          h="70vh"
          w={{
            sm: '95%',
            xl: '70%',
          }}
          templateColumns="repeat(16, 1fr)"
          templateRows="repeat(10, 1fr)"
        >
          <GridItem gridRow="1/3" gridColumn="1/-1">
            <Box h="100%">
              <Heading
                as="h1"
                size={{
                  sm: '2xl',
                  xl: '4xl',
                }}
                py={1}
                textAlign="center"
                fontWeight="bold"
                letterSpacing="wide"
                lineHeight="1.3"
                color="blue.700"
              >
                {name.toUpperCase()}
              </Heading>
              <Flex gap={5} justifyContent="center" py={1}>
                <Center gap={2}>
                  <FaPeopleGroup />
                  <Text textStyle="lg">
                    <FormatNumber value={population} />
                  </Text>
                </Center>
                <Center gap={2}>
                  <Image
                    src={`https://hatscripts.github.io/circle-flags/flags/${country_code.toLowerCase()}.svg`}
                    h="20px"
                    w="20px"
                    fit="contain"
                  ></Image>
                  <Text textStyle="md"> {country}</Text>
                </Center>
                <Center gap={2}>
                  <TbWorldLatitude />
                  <Text textStyle="lg">
                    <FormatNumber value={latitude} />
                  </Text>
                </Center>
                <Center gap={2}>
                  <TbWorldLongitude />
                  <Text textStyle="lg">
                    <FormatNumber value={longitude} />
                  </Text>
                </Center>
              </Flex>
            </Box>
          </GridItem>

          <GridItem
            gridRow="1/3"
            gridColumn="-5/-2"
            alignSelf="center"
            justifySelf="center"
          >
            <Button
              colorPalette="blue"
              variant="surface"
              px={4}
              fontSize="md"
              fontWeight="semibold"
            >
              <LiaStarSolid /> Add to favorites
            </Button>
          </GridItem>
          <GridItem gridRow="3/7" gridColumn="1/-1">
            <Box h="100%" bg="blue.300" py={1}>
              <Heading
                as="h2"
                size={{
                  sm: 'xl',
                  xl: '2xl',
                }}
                py={2}
                pl={10}
                textAlign="left"
                lineHeight="1.3"
              >
                Weather info
              </Heading>
            </Box>
          </GridItem>

          <GridItem gridRow="3/5" gridColumn="-5/-2">
            <Center gap={2} py={2}>
              <VStack>
                <Text textStyle="4xl" fontWeight="bold" color="blue.600">
                  {Math.round(weatherData.current.temperature_2m)}&nbsp;
                  {weatherData.current_units.temperature_2m}
                </Text>
                <Text
                  textStyle="lg"
                  fontWeight="semibold"
                  textAlign="center"
                  color="blue.800"
                >
                  {weatherData.current.wind_speed_10m}&nbsp;
                  {weatherData.current_units.wind_speed_10m}&nbsp;|&nbsp;
                  {new Date(weatherData.current.time).getHours()}:
                  {new Date(weatherData.current.time).getMinutes()}
                </Text>
              </VStack>
            </Center>
          </GridItem>

          {weatherData.daily.time.map((day, index) => (
            <GridItem
              gridRow={index === 0 ? '4/9' : '5/10'}
              gridColumn={`${2 * index + 2}/${2 * index + 4}`}
              textAlign="center"
              key={day}
            >
              <VStack
                gap={2}
                h="100%"
                rounded="xl"
                bg="blue.100"
                py={6}
                borderWidth="1px"
                borderColor="blue.300"
              >
                <Text textStyle="xl" fontWeight="bold">
                  {daysOfWeek[new Date(day).getDay()]}
                </Text>
                <Text textStyle="lg">
                  {index === 0
                    ? 'Today'
                    : index == 1
                    ? 'Tomorrow'
                    : `${new Date(day).getDate()}-${new Date(day).getMonth()}`}
                </Text>
                <Text textStyle="md" bg="yellow.400" p={1} rounded="sm">
                  {Math.round(weatherData.daily.temperature_2m_max[index])}
                  &nbsp;{weatherData.daily_units.temperature_2m_max}
                </Text>
                <Text textStyle="md" bg="green.300" p={1.5} rounded="sm">
                  {Math.round(weatherData.daily.temperature_2m_min[index])}
                  &nbsp;{weatherData.daily_units.temperature_2m_min}
                </Text>

                <HStack>
                  <TiWeatherWindy />
                  <Text textStyle="md">
                    {weatherData.daily.wind_speed_10m_max[index]}&nbsp;
                    {weatherData.daily_units.wind_speed_10m_max}
                  </Text>
                </HStack>

                <HStack>
                  <FaDroplet />
                  <Text textStyle="md">
                    {weatherData.daily.precipitation_probability_max[index]} %
                  </Text>
                </HStack>
              </VStack>
            </GridItem>
          ))}
        </Grid>
      </Center>
    </>
  );
}
