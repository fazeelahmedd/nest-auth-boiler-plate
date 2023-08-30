import { MigrationInterface, QueryRunner } from "typeorm";

export class changedExpiryTimeFromNumberToTime1676469838215 implements MigrationInterface {
    name = 'changedExpiryTimeFromNumberToTime1676469838215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "expiry_time"`);
        await queryRunner.query(`ALTER TABLE "otp" ADD "expiry_time" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "expiry_time"`);
        await queryRunner.query(`ALTER TABLE "otp" ADD "expiry_time" integer NOT NULL`);
    }

}
