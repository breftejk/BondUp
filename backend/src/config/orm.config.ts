import { DataSourceOptions } from 'typeorm';
import { User } from '../modules/auth/entities/user.entity';

const ormConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL!,
  entities: [User],
  synchronize: true,
  migrationsRun: true,
  migrations: ['dist/migrations/*.js'],
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
};

export default ormConfig;
