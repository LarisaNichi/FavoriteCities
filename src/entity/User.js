import { EntitySchema } from 'typeorm';

export const User = new EntitySchema({
  name: 'User',
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
});

export default User;
