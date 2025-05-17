import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747493844289 implements MigrationInterface {
    name = 'Migration1747493844289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."category_operationtype_enum" AS ENUM('expense', 'income')`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "operationType" "public"."category_operationtype_enum" NOT NULL, "userId" integer, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."account_accounttype_enum" RENAME TO "account_accounttype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."account_accounttype_enum" AS ENUM('Основной', 'Сберегательный', 'Кредитный', 'Наличные')`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "accountType" TYPE "public"."account_accounttype_enum" USING "accountType"::"text"::"public"."account_accounttype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."account_accounttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_32b856438dffdc269fa84434d9f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_32b856438dffdc269fa84434d9f"`);
        await queryRunner.query(`CREATE TYPE "public"."account_accounttype_enum_old" AS ENUM('SAVINGS', 'CURRENT', 'CASH', 'CREDIT')`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "accountType" TYPE "public"."account_accounttype_enum_old" USING "accountType"::"text"::"public"."account_accounttype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."account_accounttype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."account_accounttype_enum_old" RENAME TO "account_accounttype_enum"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TYPE "public"."category_operationtype_enum"`);
    }

}
