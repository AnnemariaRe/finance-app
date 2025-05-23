import { MigrationInterface, QueryRunner } from 'typeorm';

export class CurrencyTable9999999999997 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO category (name, "operationType", "userId") VALUES
               ('Зарплата', 'income', 1),
               ('Продукты', 'expense', 1),
               ('Транспорт', 'expense', 1),
               ('Рестораны', 'expense', 1),
               ('Жилье', 'expense', 1)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
  }
}
