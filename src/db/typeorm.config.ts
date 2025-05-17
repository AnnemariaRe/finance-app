import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 9000,
  username: 'user',
  password: 'pg_password',
  database: 'postgres_db',
  synchronize: false,
  logging: false,
  entities: ['src/entities/*.{js,ts}'],
  migrations: ['src/db/migrations/*.{js,ts}'],
});
