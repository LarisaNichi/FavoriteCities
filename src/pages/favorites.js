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
  Center,
} from '@chakra-ui/react';
import { Rating } from '@/components/ui/rating';

export default function Favorites() {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [ratingsSaved, setRatingsSaved] = useState([]);
  const { data: session } = useSession();
  const currentUser = session?.user.email;
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await fetchUserFavoriteCities().then((data) => {
        if (data.length !== 0) {
          const cities = data[0].cities;
          setFavoriteCities(cities);
        }
      });
      await fetchUserRatings(currentUser).then((data) => {
        setRatingsSaved(data);
        console.log('GET: data from ratings API', data);
      });
    })();
  }, [currentUser]);

  async function fetchUserFavoriteCities() {
    const res = await fetch('/api/cities');
    const users = await res.json();
    console.log('users from cities:', users);
    const userData = users.filter((user) => user.email === currentUser);
    return userData;
  }

  async function fetchUserRatings(email) {
    const query = new URLSearchParams({ email }).toString();
    const res = await fetch(`/api/ratings?${query}`);
    const ratings = await res.json();
    return ratings;
  }

  async function deleteCityFromFavorites(latitude, longitude, email) {
    try {
      const response = await fetch('/api/cities', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude, email }),
      });
      const result = await response.json();
      // console.log(result);
      if (response.ok) {
        const newCitiesList = favoriteCities.filter(
          (city) => city.latitude !== latitude && city.longitude !== longitude
        );
        setFavoriteCities(newCitiesList);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleRatingOnChange(e, name, latitude, longitude) {
    // {[id]:{ratingData}}
    const ratingData = {
      score: +e.target.value,
      name,
      latitude,
      longitude,
    };

    setRatings((prev) => [
      ...prev.filter(
        (rating) =>
          rating.latitude !== latitude && rating.longitude !== longitude
      ),
      ratingData,
    ]);
  }

  async function sendRatings() {
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ratings,
          email: currentUser,
        }),
      });
      const result = await response.json();
      setRatingsSaved(result);
    } catch (error) {
      console.error(error);
    }
  }

  function getCityScore(latitude, longitude) {
    const cityRating = ratingsSaved.find(
      (rating) => rating.latitude === latitude && rating.longitude === longitude
    );
    if (ratingsSaved.length !== 0 && cityRating) {
      return cityRating.score;
    } else {
      return 0;
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
        }}
        maxW={{
          base: '90%',
          sm: '75%',
          md: '85%',
          lg: '70%',
        }}
        columnGap="6"
        rowGap="2"
        mx="auto"
      >
        {favoriteCities.map(({ id, name, country, latitude, longitude }) => {
          const score = getCityScore(latitude, longitude);
          return (
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
                        query: { country, latitude, longitude },
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
                    onClick={() =>
                      deleteCityFromFavorites(latitude, longitude, currentUser)
                    }
                  >
                    Delete
                  </Button>
                  {score && (
                    <Rating
                      value={score}
                      readOnly
                      size="sm"
                      colorPalette="blue"
                    />
                  )}
                  {score === 0 && (
                    <Rating
                      defaultValue={0}
                      onChange={(e) => {
                        handleRatingOnChange(e, name, latitude, longitude);
                      }}
                      size="sm"
                      colorPalette="blue"
                    />
                  )}
                </Group>
              </Flex>
            </GridItem>
          );
        })}
      </Grid>
      <Center>
        <Button
          variant="solid"
          size="md"
          px="4"
          my="7"
          onClick={() => {
            sendRatings();
          }}
        >
          Send your Rating!
        </Button>
      </Center>
    </>
  );
}
