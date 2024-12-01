import { EntitySchema } from 'typeorm';

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
  },
});

export default User;
