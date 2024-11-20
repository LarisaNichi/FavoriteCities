import { GridItem, Stack } from '@chakra-ui/react';

export default function GridWeatherCard({ index, children }) {
  return (
    <GridItem
      gridRow={
        index === 0
          ? {
              base: `${index + 3}/${index + 4}`,
              md: '3/8',
            }
          : {
              base: `${index + 3}/${index + 4}`,
              md: '4/9',
            }
      }
      gridColumn={{
        base: '1/-1',
        sm: '2/-2',
        md: `${2 * index + 2}/${2 * index + 4}`,
      }}
      textAlign="center"
    >
      <Stack
        py={{
          base: '4',
          md: '6',
        }}
        px={{
          base: '3',
          md: '2',
        }}
        direction={{
          base: 'row',
          md: 'column',
        }}
        alignItems="center"
        justifyContent="center"
        gap="2"
        rounded="xl"
        bg="blue.100"
        borderWidth="1px"
        borderColor="blue.300"
      >
        {children}
      </Stack>
    </GridItem>
  );
}
