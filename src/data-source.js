import { DataSource } from 'typeorm';
import User from './entity/User';
import City from './entity/City';
import Rating from './entity/Rating';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './db.sqlite',
  synchronize: true,
  logging: false,
  entities: [User, City, Rating],
});
export default AppDataSource;
