import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Flex, Image, HStack, Button, Group, Center } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';
import { Tooltip } from '@/components/ui/tooltip';
import { useId } from 'react';

export default function Navigation() {
  const { data: session } = useSession();
  const id = useId();
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
    <Center bg="blue.200/75" h="7vh" px="4" w="100%" zIndex="overlay">
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

            {!session && (
              <Button css={styleButtonNav} onClick={() => signIn()}>
                Sign In
              </Button>
            )}
            {session && (
              <HStack>
                <Button css={styleButtonNav} onClick={() => signOut()}>
                  Sign Out
                </Button>

                <Tooltip
                  ids={{ trigger: id }}
                  content={session.user.email}
                  contentProps={{ css: { '--tooltip-bg': 'blue' } }}
                  positioning={{ placement: 'right-left' }}
                >
                  <Avatar ids={{ root: id }} colorPalette="blue" />
                </Tooltip>
              </HStack>
            )}
          </HStack>
        </Group>
      </Flex>
    </Center>
  );
}
