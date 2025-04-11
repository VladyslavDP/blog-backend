import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class StorageTable1744367284343 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE file_type_enum AS ENUM ('jpeg', 'png', 'jpg', 'pdf')
    `);

    await queryRunner.query(`
      CREATE TYPE bucket_enum AS ENUM ('blog-images-bucket2')
    `);

    await queryRunner.createTable(
      new Table({
        name: 'storage',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'original_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'alias',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'file_type',
            type: 'file_type_enum',
            isNullable: false,
          },
          {
            name: 'bucket',
            type: 'bucket_enum',
            isNullable: false,
          },
          {
            name: 'created_date',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_by',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          { name: 'updated_date', type: 'timestamp', isNullable: true },
          {
            name: 'updated_by',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          { name: 'deleted_date', type: 'timestamp', isNullable: true },
          {
            name: 'deleted_by',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX original_name_unique_idx ON "storage" ("original_name")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX alias_unique_idx ON "storage" ("alias")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS original_name_unique_idx`);
    await queryRunner.query(`DROP INDEX IF EXISTS alias_unique_idx`);

    await queryRunner.dropTable('storage');

    await queryRunner.query(`DROP TYPE IF EXISTS bucket_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS file_type_enum`);
  }
}
