import {
  Flex,
  Image,
  Box,
  HStack,
  Button,
  Group,
  Center,
} from '@chakra-ui/react';
import Link from 'next/link';

export default function Navigation() {
  return (
    <Center bg="blue.200/75" h="10vh">
      <Flex
        as="nav"
        justify="space-between"
        px="1.5rem"
        py="0.5rem"
        w={{ xl: '75%', lg: '75%', md: '100%', sm: '100%' }}
      >
        <Image
          src="/img/logo-transparent.png"
          alt="logo"
          aspectRatio={4 / 3}
          width="60px"
          fit="contain"
        />
        <Group gap="15px">
          <HStack as="ul" gap="10px">
            <Link href="/">
              <Button
                as="li"
                px="0.4rem"
                variant="ghost"
                colorPalette="blue"
                size="lg"

                // borderBottomColor="blue.600"
                // borderWidth="2px"
              >
                Home
              </Button>
            </Link>
            <Link href="/search">
              <Button
                as="li"
                px="0.5rem"
                variant="ghost"
                colorPalette="blue"
                size="lg"
              >
                Search
              </Button>
            </Link>

            <Link href="/favorites">
              <Button
                as="li"
                px="0.5rem"
                variant="ghost"
                colorPalette="blue"
                size="lg"
              >
                Favorites
              </Button>
            </Link>
          </HStack>
          <Button colorPalette="blue" px="1rem" size="lg">
            Sign In
          </Button>
        </Group>
      </Flex>
    </Center>
  );
}
