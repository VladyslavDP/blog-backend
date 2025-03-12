import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AddedUsersTable1741790132947 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'email', type: 'varchar', length: '255', isNullable: false },
          {
            name: 'nick_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: 'true',
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
    );

    await queryRunner.addColumn(
      'posts',
      new TableColumn({
        name: 'isActive',
        type: 'boolean',
        default: 'true',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('posts', 'isActive');

    await queryRunner.dropTable('users');
  }
}
