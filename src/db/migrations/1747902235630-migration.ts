import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747902235630 implements MigrationInterface {
  name = 'Migration1747902235630';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "date"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "date" TIMESTAMP WITH TIME ZONE NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "date"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "date" date NOT NULL`);
  }
}
