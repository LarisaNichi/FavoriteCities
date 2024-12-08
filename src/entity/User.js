import { EntitySchema, JoinColumn } from 'typeorm';

export const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    email: {
      type: 'varchar',
    },
    password: {
      type: 'varchar',
    },
  },
  relations: {
    cities: {
      target: 'City',
      type: 'many-to-many',
      joinTable: true,
      cascade: true,
      // eager: true,
    },
    ratings: {
      target: 'Rating',
      type: 'one-to-many',
      inverseSide: 'ratings',
      cascade: true,
    },
  },
});

export default User;
