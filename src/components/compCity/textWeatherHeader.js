import { Text } from '@chakra-ui/react';

export default function textWeatherHeader({ day, index }) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return (
    <>
      <Text
        textStyle={{
          base: 'lg',
          lg: 'xl',
        }}
        fontWeight="bold"
        mr={{
          base: 'auto',
          md: '0',
        }}
        ml={{
          base: '1',
          sm: '4',
          md: '0',
        }}
      >
        {daysOfWeek[new Date(day).getDay()]}
      </Text>
      <Text
        textStyle={{
          base: 'md',
          lg: 'lg',
        }}
      >
        {index === 0
          ? 'Today'
          : `${String(new Date(day).getDate()).padStart(2, 0)}-${String(
              new Date(day).getMonth()
            ).padStart(2, 0)}`}
      </Text>
    </>
  );
}
