import {
  AbsoluteCenter,
  Box,
  Table,
  IconButton,
  Image,
} from '@chakra-ui/react';

import { GrSelect } from 'react-icons/gr';
import Link from 'next/link';

// https://hatscripts.github.io/circle-flags/flags/xx.svg

export default function SearchTable({ citiesData }) {
  return (
    <>
      <Box position="relative" w="100%" h="70%">
        <AbsoluteCenter axis="both" w="60%">
          <Table.Root
            size="lg"
            interactive
            stickyHeader
            variant="outline"
            colorPalette="blue"
          >
            <Table.ColumnGroup>
              <Table.Column />
              <Table.Column htmlWidth="40%" />
              <Table.Column htmlWidth="40%" />
              <Table.Column />
              <Table.Column />
            </Table.ColumnGroup>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader py="2" pl="5">
                  Flag
                </Table.ColumnHeader>
                <Table.ColumnHeader>City Name</Table.ColumnHeader>
                <Table.ColumnHeader>Country</Table.ColumnHeader>
                <Table.ColumnHeader>Select</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {citiesData.map(({ name, country, country_code, id }) => (
                <Table.Row key={id}>
                  <Table.Cell py="1.5" pl="5">
                    <Image
                      src={`https://hatscripts.github.io/circle-flags/flags/${country_code.toLowerCase()}.svg`}
                      h="25px"
                      w="25px"
                      fit="contain"
                    ></Image>
                  </Table.Cell>
                  <Table.Cell>{name}</Table.Cell>
                  <Table.Cell>{country}</Table.Cell>
                  <Table.Cell>
                    <Link href="/city">
                      <IconButton
                        type="button"
                        aria-label="select"
                        size="xs"
                        variant="outline"
                        colorPalette="blue"
                      >
                        <GrSelect />
                      </IconButton>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </AbsoluteCenter>
      </Box>
    </>
  );
}
