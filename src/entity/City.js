import { EntitySchema } from 'typeorm';

export const City = new EntitySchema({
  name: 'City',
  tableName: 'cities',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
    },
    country: {
      type: 'varchar',
    },
    latitude: {
      type: 'varchar',
    },
    longitude: {
      type: 'varchar',
    },
  },
  relations: {
    users: {
      target: 'User',
      type: 'many-to-many',
      inverseSide: 'cities',
    },
    ratings: {
      target: 'Rating',
      type: 'one-to-many',
      cascade: true,
    },
  },
});

export default City;
