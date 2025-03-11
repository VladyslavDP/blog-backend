import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addedFieldToPostTable1741688426327 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'posts',
      new TableColumn({
        name: 'time_to_read',
        type: 'smallint',
        isNullable: false,
        default: 5,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('posts', 'time_to_read');
  }
}
