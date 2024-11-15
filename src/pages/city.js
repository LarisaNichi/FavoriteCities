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
} from '@chakra-ui/react';
import { FaPeopleGroup } from 'react-icons/fa6';
import { TbWorldLatitude } from 'react-icons/tb';
import { TbWorldLongitude } from 'react-icons/tb';

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

  if (Object.keys(localSelectedCity).length === 0) return null;
  const { name, country, latitude, longitude, population, country_code, id } =
    localSelectedCity;

  return (
    <>
      <Navigation />

      <Center my={10}>
        <Grid
          h="70vh"
          w="80%"
          templateColumns="repeat(16, 1fr)"
          templateRows="repeat(9, 1fr)"
          // gap={4}
          borderWidth="5px"
          borderColor="yellow.400"
          justifyItems="stretch"
          alignItems="stretch"
          justifyContent="center"
          alignContent="center"
        >
          <GridItem gridRow="1/3" colSpan={16}>
            <Box borderWidth="5px" borderColor="red.600" h="100%">
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

          <GridItem gridRow="3/7" gridColumn="1/-1">
            <Box borderWidth="5px" borderColor="red.600" h="100%" bg="blue.300">
              <Heading
                as="h2"
                size={{
                  sm: 'xl',
                  xl: '2xl',
                }}
                py={1}
                textAlign="left"
                fontWeight="bold"
                letterSpacing="wide"
                lineHeight="1.3"
              >
                Weather info
              </Heading>
            </Box>
          </GridItem>

          <GridItem gridRow="3/5" gridColumn="14/16">
            <Box borderWidth="5px" borderColor="red.600" h="100%">
              <Center gap={2}>
                <Text textStyle="lg">
                  {/* {weatherData.current.temperature_2m} */}
                </Text>
              </Center>
            </Box>
          </GridItem>

          <GridItem gridRow="4/9" gridColumn={`${2}/${4}`}>
            <Box borderWidth="5px" borderColor="red.600" h="100%">
              Zi 1
            </Box>
          </GridItem>
          <GridItem gridRow="4/9" gridColumn={`${4}/${6}`}>
            <Box borderWidth="5px" borderColor="red.600" h="100%">
              Zi 2
            </Box>
          </GridItem>
          <GridItem gridRow="4/9" gridColumn={`${6}/${8}`}>
            <Box borderWidth="5px" borderColor="red.600" h="100%">
              Zi 3
            </Box>
          </GridItem>
        </Grid>
      </Center>
    </>
  );
}
