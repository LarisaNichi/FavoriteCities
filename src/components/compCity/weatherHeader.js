import TextWeatherContent from './textWeatherContent';
import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { HStack, VStack, Button, Center, Text } from '@chakra-ui/react';
import { LiaStarSolid } from 'react-icons/lia';

export default function WeatherHeader({ weatherData, cityData }) {
  const [cityIsSavedToFavorites, setCityIsSavedToFavorites] = useState();
  const { data: session } = useSession();
  const currentUser = session?.user.email;
  const { cityId, country, latitude, longitude } = cityData;

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/cities');
      const users = await res.json();
      const userData = users.filter((user) => user.email === currentUser);
      if (userData.length !== 0) {
        const cities = userData[0].cities;
        const isSavedToFavorites = cities.some(
          (city) => city.latitude === latitude && city.longitude === longitude
        );
        setCityIsSavedToFavorites(isSavedToFavorites);
      }
    })();
  }, [latitude, longitude, currentUser]);

  async function addToFavorites() {
    try {
      const response = await fetch('/api/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cityToSave: {
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
        body: JSON.stringify({
          latitude,
          longitude,
          email: session.user.email,
        }),
      });
      const result = await response.json();
      setCityIsSavedToFavorites(result);
    } catch (error) {
      console.error(error);
    }
  }

  function handleClick() {
    if (!session) {
      signIn();
    }
    if (session && !cityIsSavedToFavorites) {
      addToFavorites();
    }
    if (session && cityIsSavedToFavorites) {
      deleteCityFromFavorites();
    }
  }

  return (
    <HStack justifyContent="space-between" pt="4" pb="2">
      <Button
        colorPalette="blue"
        variant="surface"
        px="4"
        fontSize="md"
        fontWeight="semibold"
        onClick={handleClick}
      >
        <LiaStarSolid />
        {cityIsSavedToFavorites ? 'Delete from favorites' : 'Add to favorites'}
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
              weatherDataUnits={weatherData.current_units.wind_speed_10m}
              textStyle="lg"
            />
            <Text textStyle="lg">
              |&nbsp;
              {`${new Date(weatherData.current.time).getHours()}`.padStart(
                2,
                0
              )}
              :
              {`${new Date(weatherData.current.time).getMinutes()}`.padStart(
                2,
                0
              )}
            </Text>
          </HStack>
        </VStack>
      </Center>
    </HStack>
  );
}
