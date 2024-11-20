import { FaPeopleGroup } from 'react-icons/fa6';
import { TbWorldLatitude } from 'react-icons/tb';
import { TbWorldLongitude } from 'react-icons/tb';
import {
  Box,
  Text,
  Heading,
  Flex,
  Center,
  Image,
  FormatNumber,
} from '@chakra-ui/react';

export default function CityHeader({ localSelectedCity }) {
  const { name, country, latitude, longitude, population, country_code } =
    localSelectedCity;

  return (
    <Box as="header" h="100%">
      <Heading
        as="h1"
        size={{
          base: '2xl',
          md: '3xl',
          xl: '4xl',
        }}
        p="2"
        textAlign="center"
        fontWeight="bold"
        letterSpacing="wide"
        lineHeight="1.3"
        color="blue.700"
      >
        {name.toUpperCase()}
      </Heading>
      <Flex gap="5" justifyContent="center" p="2" mb="4" textStyle="lg">
        <Center gap="2">
          <FaPeopleGroup />
          <Text>
            <FormatNumber value={population} />
          </Text>
        </Center>
        <Center gap="2">
          <Image
            src={`https://hatscripts.github.io/circle-flags/flags/${country_code.toLowerCase()}.svg`}
            h="20px"
            w="20px"
            fit="contain"
          ></Image>
          <Text> {country}</Text>
        </Center>
        <Center gap="2">
          <TbWorldLatitude />
          <Text>
            <FormatNumber value={latitude} />
          </Text>
        </Center>
        <Center gap="2">
          <TbWorldLongitude />
          <Text>
            <FormatNumber value={longitude} />
          </Text>
        </Center>
      </Flex>
    </Box>
  );
}
