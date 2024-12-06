import { Children } from 'react';
import { Box, AbsoluteCenter } from '@chakra-ui/react';

export default function HomeLayout({ children }) {
  return (
    <>
      <Box
        bgImage="url(/img/background.jpg)"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        bgAttachment="fixed"
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
        {children}
      </AbsoluteCenter>
    </>
  );
}
