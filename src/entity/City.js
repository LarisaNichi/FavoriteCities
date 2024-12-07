import { EntitySchema } from 'typeorm';

export const City = new EntitySchema({
  name: 'City',
  tableName: 'cities',
  columns: {
    id: {
      type: 'varchar',
      primary: true,
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
  },
});

export default City;
