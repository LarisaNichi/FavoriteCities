import HomeCitiesContent from './homeCitiesContent';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Heading,
  Box,
  AbsoluteCenter,
  Button,
  VStack,
  Grid,
  GridItem,
} from '@chakra-ui/react';

export default function HomeContent({ randomFavoriteCities, randomCities }) {
  const { data: session } = useSession();

  return (
    <>
      <Box
        bgImage="url(/img/background.jpg)"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        h="93vh"
        w="100%"
        position="relative"
      ></Box>
      <AbsoluteCenter
        bg="blue.50/65"
        p="8"
        axis="both"
        h={{ base: '85%', sm: '60%' }}
        w={{ base: '90%', md: '80%', xl: '50%' }}
        borderRadius="lg"
      >
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(10, 1fr)' }}
          gap="6"
          height="100%"
          alignItems="center"
        >
          <GridItem colSpan={{ base: '1', sm: '3' }}>
            {session && (
              <HomeCitiesContent
                cities={randomFavoriteCities}
              ></HomeCitiesContent>
            )}
            {!session && (
              <HomeCitiesContent cities={randomCities}></HomeCitiesContent>
            )}
          </GridItem>
          <GridItem colSpan={{ base: '1', sm: '4' }} alignSelf="center">
            <VStack gap="9">
              <Heading
                as="h1"
                size={{
                  base: '2xl',
                  sm: '3xl',
                  xl: '4xl',
                }}
                textAlign="center"
                fontWeight="bold"
                letterSpacing="wide"
                lineHeight="1.3"
                color="blue.700"
              >
                Discover the BEST destinations in the world
              </Heading>
              <Link href="/search">
                <Button colorPalette="gray" px="4" size="xl" variant="solid">
                  Start Now
                </Button>
              </Link>
            </VStack>
          </GridItem>
          <GridItem colSpan={{ base: '1', sm: '3' }} gap="4">
            <HomeCitiesContent cities={randomCities}></HomeCitiesContent>
          </GridItem>
        </Grid>
      </AbsoluteCenter>
    </>
  );
}
