import Navigation from '@/components/navigation';
import { Heading } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export default function City() {
  const [localSelectedCity, setLocalSelectedCity] = useState({});
  useEffect(() => {
    let selectedCity;
    selectedCity = JSON.parse(localStorage.getItem('selectedCity')) || '';
    setLocalSelectedCity(selectedCity);
  }, []);
  console.log(localSelectedCity);
  const { name, country, latitude, longitude, population, country_code, id } =
    localSelectedCity;

  async function weatherData() {}

  return (
    <>
      <Navigation />
      <Heading as="h1">I am the City Page</Heading>
    </>
  );
}
