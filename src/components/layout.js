import Navigation from '@/components/navigation';
import { Center, Box } from '@chakra-ui/react';

export default function Layout({ children }) {
  return (
    <Box as="main">
      <Center>
        <Box h="100vh" bg="blue.50" w="100vw" overflow="auto">
          <Navigation />
          {children}
        </Box>
      </Center>
    </Box>
  );
}
