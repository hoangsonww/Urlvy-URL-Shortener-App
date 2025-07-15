import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUser1700000000001 implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`
        CREATE TABLE "user" (
                                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                                "email" character varying NOT NULL,
                                "passwordHash" character varying NOT NULL,
                                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                                CONSTRAINT "UQ_user_email" UNIQUE ("email"),
                                CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
        );
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE "user";`);
  }
}
