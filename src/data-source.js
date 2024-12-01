import { DataSource } from 'typeorm';
import User from './entity/User';
import City from './entity/City';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './db.sqlite',
  synchronize: true,
  logging: false,
  entities: [User, City],
});
export default AppDataSource;
