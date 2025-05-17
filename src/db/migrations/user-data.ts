import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUserTable1715960000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "user" (email, name, password, "createdAt", "updatedAt") VALUES
        ('test@mail.com', 'test user', 'hashed_password_1', NOW(), NOW())
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
