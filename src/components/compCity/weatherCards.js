import GridWeatherCard from './gridWeatherCard';
import TextWeatherContent from './textWeatherContent';
import TextWeatherHeader from './textWeatherHeader';
import { HStack } from '@chakra-ui/react';
import { TiWeatherWindy } from 'react-icons/ti';
import { FaDroplet } from 'react-icons/fa6';

export default function WeatherCards({ weatherData }) {
  return weatherData.daily.time.map((day, index) => (
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
          weatherData={weatherData.daily.precipitation_probability_max[index]}
          weatherDataUnits={
            weatherData.daily_units.precipitation_probability_max
          }
        />
      </HStack>
    </GridWeatherCard>
  ));
}
