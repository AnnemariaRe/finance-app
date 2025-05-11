import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',                      
  host: 'db',
  port: 5432,
  username: 'user',
  password: 'pg_password',
  database: 'postgres_db',
  synchronize: true,                     
  logging: false,
  entities: ['src/entities/*.{js,ts}'],
  migrations: ['db/migrations/*.{js,ts}'],
});

