import Link from 'next/link';
import { VStack, Card } from '@chakra-ui/react';

export default function HomeCitiesContent({ cities }) {
  return (
    <VStack gap={{ base: '2', sm: '4' }}>
      {cities.map(({ id, name, country, latitude, longitude }) => (
        <Card.Root
          key={id}
          width="100%"
          variant="subtle"
          bg="blue.100"
          color="blue.700"
          textAlign="center"
        >
          <Link
            href={{
              pathname: `/city/${name}`,
              query: { country, latitude, longitude },
            }}
          >
            <Card.Body p="2" fontWeight="semibold">
              <Card.Title>{name}</Card.Title>
              <Card.Description>{country}</Card.Description>
            </Card.Body>
          </Link>
        </Card.Root>
      ))}
    </VStack>
  );
}
