import { Center, Box } from '@chakra-ui/react';

export default function Layout({ children }) {
  return (
    <Box as="main">
      <Center>
        <Box position="relative" h="100vh" bg="blue.50" w="100%">
          {children}
        </Box>
      </Center>
    </Box>
  );
}
