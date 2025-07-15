import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1700000000000 implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await q.query(`
        CREATE TABLE "url" (
                               "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                               "slug" character varying NOT NULL,
                               "destination" character varying NOT NULL,
                               "title" character varying,
                               "summary" text,
                               "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                               CONSTRAINT "UQ_url_slug" UNIQUE ("slug"),
                               CONSTRAINT "PK_url_id" PRIMARY KEY ("id")
        );
    `);
    await q.query(`
        CREATE TABLE "click" (
                                 "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                                 "ip" character varying NOT NULL,
                                 "userAgent" character varying NOT NULL,
                                 "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                                 "urlId" uuid,
                                 CONSTRAINT "PK_click_id" PRIMARY KEY ("id")
        );
    `);
    await q.query(`
      ALTER TABLE "click"
      ADD CONSTRAINT "FK_click_url" FOREIGN KEY ("urlId")
      REFERENCES "url"("id") ON DELETE CASCADE;
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE "click" DROP CONSTRAINT "FK_click_url";`);
    await q.query(`DROP TABLE "click";`);
    await q.query(`DROP TABLE "url";`);
  }
}
