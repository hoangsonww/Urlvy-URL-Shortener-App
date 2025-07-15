import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Url } from "./entities/url.entity";
import { UrlService } from "./url.service";
import { UrlController } from "./url.controller";
import { ClickModule } from "../click/click.module";
import { AI_Module } from "../ai/ai.module";

@Module({
  imports: [TypeOrmModule.forFeature([Url]), ClickModule, AI_Module],
  providers: [UrlService],
  controllers: [UrlController],
  exports: [UrlService],
})
export class UrlModule {}
