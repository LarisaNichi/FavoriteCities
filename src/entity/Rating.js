import { EntitySchema } from 'typeorm';

export const Rating = new EntitySchema({
  name: 'Rating',
  tableName: 'ratings',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    score: {
      type: 'int',
    },
    name: {
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
    cities: {
      target: 'City',
      type: 'many-to-one',
      joinColumn: true,
      inverseSide: 'ratings',
    },
    users: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: true,
      inverseSide: 'ratings',
    },
  },
});

export default Rating;
