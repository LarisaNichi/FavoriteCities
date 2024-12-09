import { useRouter } from 'next/router';
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

export default function FavoritesContent({
  favoriteCities,
  getCityScore,
  deleteCityFromFavorites,
  handleRatingOnChange,
  sendRatings,
}) {
  const router = useRouter();

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
