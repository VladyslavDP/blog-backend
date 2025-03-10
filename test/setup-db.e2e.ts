import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { Client } from 'pg';
import { initializeTransactionalContext } from 'typeorm-transactional';

let postgresContainer: StartedPostgreSqlContainer;
let postgresClient: Client;

beforeAll(async () => {
  initializeTransactionalContext();

  postgresContainer = await new PostgreSqlContainer(
    'postgres:alpine3.19',
  ).start();

  postgresClient = new Client({
    host: postgresContainer.getHost(),
    port: postgresContainer.getPort(),
    database: postgresContainer.getDatabase(),
    user: postgresContainer.getUsername(),
    password: postgresContainer.getPassword(),
  });

  await postgresClient.connect();

  process.env.PG_DATABASE_HOST = postgresContainer.getHost();
  process.env.PG_DATABASE_PORT = postgresContainer.getPort() + '';
  process.env.PG_DATABASE_USERNAME = postgresContainer.getUsername();
  process.env.PG_DATABASE_PASSWORD = postgresContainer.getUsername();
  process.env.PG_DATABASE_NAME = postgresContainer.getDatabase();
});

afterAll(async () => {
  await postgresClient.end();
  await postgresContainer.stop();
});

export { postgresClient };
