import Link from 'next/link';
import { Flex, Image, HStack, Button, Group, Center } from '@chakra-ui/react';

export default function Navigation() {
  const tabs = [
    { label: 'Home', path: '/' },
    { label: 'Search', path: '/search' },
    { label: 'Favorites', path: '/favorites' },
  ];

  const styleButtonNav = {
    px: {
      base: '2',
      sm: '3',
    },
    colorPalette: 'blue',
    size: 'md',
    fontSize: 'md',
  };

  return (
    <Center bg="blue.200/75" h="7vh" px="4">
      <Flex
        as="nav"
        justify="space-between"
        w={{ base: '100%', md: '75%', '2xl': '50%' }}
      >
        <Image
          src="/img/logo-transparent.png"
          alt="logo"
          aspectRatio={4 / 3}
          width="60px"
          fit="contain"
        />
        <Group gap="3">
          <HStack as="ul" gap="2">
            {tabs.map(({ label, path }) => (
              <Link href={path} key={path}>
                <Button as="li" css={styleButtonNav} variant="ghost">
                  {label}
                </Button>
              </Link>
            ))}
          </HStack>

          <Button css={styleButtonNav}>Sign In</Button>
        </Group>
      </Flex>
    </Center>
  );
}
