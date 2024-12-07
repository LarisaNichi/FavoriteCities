import Link from 'next/link';
import { Heading, Button, VStack, Card } from '@chakra-ui/react';

export default function HomeMainContent({ location, loading }) {
  const { city, country, latitude, longitude } = location;
  return (
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

      {Object.keys(location).length !== 0 && (
        <Card.Root
          variant="subtle"
          bg="blue.600"
          color="white"
          textAlign="center"
          px="3"
          py="1"
        >
          <Link
            href={{
              pathname: `/city/${city}`,
              query: { country, latitude, longitude },
            }}
          >
            <Card.Body p="2" fontWeight="semibold">
              <Card.Title>{loading ? 'Loading...' : `${city}`}</Card.Title>
              <Card.Description color="white">{country}</Card.Description>
            </Card.Body>
          </Link>
        </Card.Root>
      )}
    </VStack>
  );
}
