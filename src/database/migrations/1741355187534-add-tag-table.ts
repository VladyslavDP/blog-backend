import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTagTable1741355187534 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "tags" (
            "id" uuid NOT NULL,
            "name" character varying NOT NULL UNIQUE,
            "created_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
            "created_by" uuid NOT NULL,
            "updated_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
            "updated_by" uuid,
            "deleted_date" TIMESTAMP WITHOUT TIME ZONE,
            "deleted_by" uuid,
            CONSTRAINT "clients_pk" PRIMARY KEY ("id")
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tags');
  }
}
