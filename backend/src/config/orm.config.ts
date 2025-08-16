import { DataSourceOptions } from 'typeorm';
import { User } from '../modules/user/entities/user.entity';
import { Invite } from '../modules/invites/entities/invite.entitity';

const ormConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL!,
  entities: [User, Invite],
  synchronize: true,
  migrationsRun: true,
  migrations: ['dist/migrations/*.js'],
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
};

export default ormConfig;
