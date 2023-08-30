import { MigrationInterface, QueryRunner } from 'typeorm';

export class changedOtpCodeToString1676468083982 implements MigrationInterface {
  name = 'changedOtpCodeToString1676468083982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "code"`);
    await queryRunner.query(
      `ALTER TABLE "otp" ADD "code" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "otp" ADD "code" integer NOT NULL`);
  }
}
