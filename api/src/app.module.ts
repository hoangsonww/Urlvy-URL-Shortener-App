import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import configuration from "./config/configuration";
import { validationSchema } from "./config/validation";

import { AI_Module } from "./ai/ai.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { UrlModule } from "./url/url.module";
import { ClickModule } from "./click/click.module";
import { StatsModule } from "./stats/stats.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: "postgres",
        url: cfg.get<string>("databaseUrl"),
        autoLoadEntities: true,
        synchronize: false,
        ssl: { rejectUnauthorized: false },
        extra: {
          ssl: { rejectUnauthorized: false },
        },
      }),
    }),
    AI_Module,
    UserModule,
    AuthModule,
    UrlModule,
    ClickModule,
    StatsModule,
  ],
})
export class AppModule {}
