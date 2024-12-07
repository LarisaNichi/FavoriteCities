import { Text } from '@chakra-ui/react';

export default function textWeatherContent({
  weatherData,
  weatherDataUnits,
  ...props
}) {
  return (
    <Text
      textStyle={{
        base: 'md',
        lg: 'lg',
      }}
      {...props}
    >
      {Math.round(weatherData)}
      &nbsp;{weatherDataUnits}
    </Text>
  );
}
