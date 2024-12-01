import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  Heading,
  Box,
  Grid,
  GridItem,
  Text,
  Group,
  Button,
  Flex,
} from '@chakra-ui/react';

export default function Favorites() {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const { data: session } = useSession();
  const currentUser = session?.user.email;
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/cities');
      const users = await res.json();
      const userData = users.filter((user) => user.email === currentUser);
      if (userData.length !== 0) {
        const cities = userData[0].cities;
        // console.log('cities:', cities);
        setFavoriteCities(cities);
      }
    })();
  }, [currentUser]);

  async function deleteCityFromFavorites(id, email) {
    try {
      const response = await fetch('/api/cities', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, email }),
      });
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        const newCitiesList = favoriteCities.filter((city) => city.id !== id);
        setFavoriteCities(newCitiesList);
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (favoriteCities.length === 0) {
    return null;
  }

  return (
    <>
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
          Your favorite cities
        </Heading>
      </Box>
      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          xl: 'repeat(3, 1fr)',
        }}
        maxW={{
          base: '90%',
          sm: '70%',
          md: '80%',
          lg: '70%',
        }}
        columnGap="6"
        rowGap="2"
        mx="auto"
      >
        {favoriteCities.map(({ id, name, country, latitude, longitude }) => (
          <GridItem key={id}>
            <Flex
              gap="6"
              justifyContent="space-between"
              alignItems="center"
              bg="blue.100"
              py="2"
              px="5"
            >
              <Box textAlign="left">
                <Text>
                  {name}, {country}
                </Text>
              </Box>
              <Group>
                <Button
                  variant="solid"
                  colorPalette="blue"
                  size="sm"
                  px="2"
                  onClick={() => {
                    router.push({
                      pathname: `/city/${name}`,
                      query: { country, latitude, longitude, id },
                    });
                  }}
                >
                  View
                </Button>
                <Button
                  variant="subtle"
                  colorPalette="blue"
                  size="sm"
                  px="2"
                  onClick={() => deleteCityFromFavorites(id, currentUser)}
                >
                  Delete
                </Button>
              </Group>
            </Flex>
          </GridItem>
        ))}
      </Grid>
    </>
  );
}
