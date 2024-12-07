import { useRouter } from 'next/router';
import { Table, IconButton, Image, VStack } from '@chakra-ui/react';
import { GrSelect } from 'react-icons/gr';

export default function SearchTable({ citiesData }) {
  const router = useRouter();
  return (
    <>
      <VStack
        w={{ base: '90%', md: '80%', lg: '65%', xl: '50%' }}
        mx="auto"
        my="10"
      >
        <Table.Root
          size={{ base: 'md', sm: 'lg' }}
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
              ({ name, country, latitude, longitude, country_code, id }) => (
                <Table.Row key={id}>
                  <Table.Cell py="1.5" pl={{ base: '2', sm: '5' }}>
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
                        router.push({
                          pathname: `/city/${name}`,
                          query: { country, latitude, longitude, id },
                        });
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
      </VStack>
    </>
  );
}
