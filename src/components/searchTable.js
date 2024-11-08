import {
  AbsoluteCenter,
  Box,
  Table,
  IconButton,
  Image,
} from '@chakra-ui/react';

import { GrSelect } from 'react-icons/gr';
import { useRouter } from 'next/router';

// https://hatscripts.github.io/circle-flags/flags/xx.svg

export default function SearchTable({ citiesData }) {
  const router = useRouter();
  return (
    <>
      <Box position="relative" w="100%" h="65vh">
        <AbsoluteCenter axis="both" w="70%">
          <Table.Root
            size="lg"
            interactive
            stickyHeader
            variant="outline"
            colorPalette="blue"
          >
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader py="1.5" pl="5">
                  Flag
                </Table.ColumnHeader>
                <Table.ColumnHeader>City Name</Table.ColumnHeader>
                <Table.ColumnHeader>Country</Table.ColumnHeader>
                <Table.ColumnHeader>Latitude</Table.ColumnHeader>
                <Table.ColumnHeader>Longitude</Table.ColumnHeader>
                <Table.ColumnHeader>Code</Table.ColumnHeader>
                <Table.ColumnHeader>Select</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {citiesData.map(
                ({
                  name,
                  country,
                  latitude,
                  longitude,
                  population,
                  country_code,
                  id,
                }) => (
                  <Table.Row key={id}>
                    <Table.Cell py="1.2" pl="5">
                      <Image
                        src={`https://hatscripts.github.io/circle-flags/flags/${country_code.toLowerCase()}.svg`}
                        h="25px"
                        w="25px"
                        fit="contain"
                      ></Image>
                    </Table.Cell>
                    <Table.Cell>{name}</Table.Cell>
                    <Table.Cell>{country}</Table.Cell>
                    <Table.Cell>{latitude}</Table.Cell>
                    <Table.Cell>{longitude}</Table.Cell>
                    <Table.Cell>{country_code}</Table.Cell>
                    <Table.Cell>
                      <IconButton
                        onClick={() => {
                          localStorage.setItem(
                            'selectedCity',
                            JSON.stringify({
                              name,
                              country,
                              latitude,
                              longitude,
                              population,
                              country_code,
                            })
                          );
                          router.push('/city');
                        }}
                        type="button"
                        aria-label="select"
                        size="xs"
                        variant="outline"
                        colorPalette="blue"
                      >
                        <GrSelect />
                      </IconButton>
                    </Table.Cell>
                  </Table.Row>
                )
              )}
            </Table.Body>
          </Table.Root>
        </AbsoluteCenter>
      </Box>
    </>
  );
}
