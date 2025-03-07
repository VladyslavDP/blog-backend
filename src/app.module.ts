import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  addTransactionalDataSource,
  getDataSourceByName,
} from 'typeorm-transactional';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return { ...ormConfig, port: +process.env.PG_DATABASE_PORT };
      },
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid data source options!');
        }
        return (
          getDataSourceByName('default') ||
          addTransactionalDataSource(new DataSource(options))
        );
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
