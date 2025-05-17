import { MigrationInterface, QueryRunner } from 'typeorm';

export class CurrencyTable1747472320382 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO currency (name, code, symbol, "createdAt") VALUES
          ('Российский Рубль', 'RUB', '₽', NOW()),
          ('Доллар', 'USD', '$', NOW()),
          ('Евро', 'EUR', '€', NOW()),
          ('Британский фунт', 'GBP', '£', NOW()),
          ('Казахстанский Тенге', 'KZT', '₸', NOW())
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
  }
}
