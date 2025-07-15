// ormconfig.ts
import { DataSource } from "typeorm";
import configuration from "./src/config/configuration";

import { Url } from "./src/url/entities/url.entity";
import { Click } from "./src/click/entities/click.entity";
import { User } from "./src/user/entities/user.entity";

const config = configuration();

// Check for PGSSLMODE=disable
const disableSsl = process.env.PGSSLMODE === "disable";

// If SSL is disabled, pass `ssl: false` to the pg driver
// Otherwise use your override to accept the self-signed cert
const sslConfig = disableSsl ? false : { rejectUnauthorized: false };

export default new DataSource({
  type: "postgres",
  url: config.databaseUrl,
  ssl: sslConfig,
  extra: {
    ssl: sslConfig,
  },
  entities: [Url, Click, User],
  migrations: ["migrations/*.ts"],
  synchronize: false,
});
