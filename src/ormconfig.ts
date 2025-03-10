import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const ormConfig: TypeOrmModuleOptions = {
  ...(process.env.PG_DATABASE_SSL === 'true' && { ssl: true }),
  type: 'postgres',
  host: process.env.PG_DATABASE_HOST,
  port: +process.env.PG_DATABASE_PORT,
  username: process.env.PG_DATABASE_USERNAME,
  password: process.env.PG_DATABASE_PASSWORD,
  database: process.env.PG_DATABASE_NAME,
  migrations: [__dirname + '/database/migrations/*{.js,.ts}'],
  entities: [__dirname + '/common/domain/entities/**/*.entity{.js,.ts}'],
  synchronize: false,
  migrationsRun: true,
  migrationsTransactionMode: 'each',
  logging: false,
  // keepConnectionAlive: true,
  retryAttempts: 10,
  retryDelay: 2000,
  extra: {
    poolSize: +process.env.PG_DATABASE_POOL_SIZE || 20,
    connectionTimeoutMillis: 10000,
    query_timeout: 10000,
    ...(process.env.PG_DATABASE_SSL === 'true' && {
      ssl: {
        rejectUnauthorized: false,
      },
    }),
  },
  cache: {
    type: 'ioredis',
    options: {
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      ...(process.env.REDIS_TLS === 'true' && { tls: {} }),
    },
  },
};

export default ormConfig;
