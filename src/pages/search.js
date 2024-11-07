import Navigation from '@/components/navigation';
import SearchTable from '@/components/searchTable';
import {
  Heading,
  Fieldset,
  Input,
  HStack,
  Center,
  Box,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { LuSearch } from 'react-icons/lu';
import { useState, useEffect } from 'react';

export default function Search() {
  const [cityInput, setCityInput] = useState('');
  const [citiesData, setCitiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSearchInput(e) {
    setCityInput(e.target.value);
  }

  async function getCityData() {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=10&language=en&format=json`
      );

      setCityInput('');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const cities = data.results;
      setCitiesData(cities);
      // console.log('cities inside the function:', cities);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }
  // const [{ name, country, latitude, longitude, population, country_code }] =
  //   cities;

  // console.log('cities outside the function', citiesData);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    getCityData();
    setCityInput('');
    setIsSubmitted(true);
  }

  return (
    <>
      <Navigation />
      <Box>
        <Heading
          as="h1"
          color="blue.700"
          size={{
            sm: '2xl',
            xl: '4xl',
          }}
          textAlign="center"
          fontWeight="bold"
          letterSpacing="wide"
          lineHeight="1.3"
          my="10"
        >
          Which is your favorite destination?
        </Heading>
        <Center as="form" onSubmit={handleSearchSubmit} px="10">
          <Fieldset.Root size="lg" maxW="2xl">
            <HStack gap="5">
              <Fieldset.Legend fontWeight="500" lineHeight="1.3">
                Select your city
              </Fieldset.Legend>
              <Fieldset.Content>
                <Field label="">
                  <Input
                    onChange={handleSearchInput}
                    name="name"
                    value={cityInput || ''}
                    required
                    placeholder="City name"
                    _placeholder={{ color: 'blue.400' }}
                    textAlign="center"
                    colorPalette="blue"
                    fontSize="md"
                    bg="gray.100/70"
                  />
                </Field>
              </Fieldset.Content>
              <IconButton type="submit" aria-label="Search database" p="5">
                <LuSearch />
                {isLoading ? 'Loading...' : 'Search'}
              </IconButton>
            </HStack>
          </Fieldset.Root>
        </Center>
      </Box>

      {isSubmitted && !citiesData && (
        <Center my="10" fontSize="lg" fontWeight="600" color="orange.700">
          No city was found. Try another search!
        </Center>
      )}

      {error && (
        <VStack my="10" fontSize="lg" fontWeight="500" color="orange.700">
          <Text>Ups...{error}</Text>
          <Text>There was an error in retreiving the data.</Text>
          <Text> Please try again later!</Text>
        </VStack>
      )}

      {isSubmitted && citiesData && citiesData.length > 1 && (
        <SearchTable citiesData={citiesData}></SearchTable>
      )}
    </>
  );
}