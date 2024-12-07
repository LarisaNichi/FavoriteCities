import { useRouter } from 'next/router';
import { Button, VStack } from '@chakra-ui/react';

export default function HomeCitiesContent({ cities }) {
  const router = useRouter();
  return (
    <VStack gap={{ base: '2', sm: '4' }}>
      {cities.map(({ id, name, country, latitude, longitude }) => (
        <Button
          key={id}
          variant="subtle"
          width="100%"
          size="md"
          colorPalette="blue"
          lineHeight="1.2"
          py="7"
          onClick={() => {
            router.push({
              pathname: `/city/${name}`,
              query: { country, latitude, longitude, id },
            });
          }}
        >
          <VStack>
            <span>{name}</span>
            <span>{country}</span>
          </VStack>
        </Button>
      ))}
    </VStack>
  );
}
