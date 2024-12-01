import TextWeatherContent from './textWeatherContent';
import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import { HStack, VStack, Button, Center, Text } from '@chakra-ui/react';
import { LiaStarSolid } from 'react-icons/lia';

export default function WeatherHeader({
  weatherData,
  addToFavorites,
  deleteCityFromFavorites,
  cityIsSavedToFavorites,
}) {
  const [isToggled, setIsToggled] = useState(false);
  const { data: session } = useSession();

  function handleClick() {
    if (!session) {
      signIn();
    }
    if (session && !cityIsSavedToFavorites) {
      addToFavorites();
      setIsToggled(true);
    }
    if (session && cityIsSavedToFavorites) {
      deleteCityFromFavorites();
      setIsToggled(false);
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
        {isToggled ? 'Delete from favorites' : 'Add to favorites'}
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
