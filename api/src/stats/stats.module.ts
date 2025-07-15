import { Module } from "@nestjs/common";
import { StatsController } from "./stats.controller";
import { UrlModule } from "../url/url.module";
import { ClickModule } from "../click/click.module";

@Module({
  imports: [UrlModule, ClickModule],
  controllers: [StatsController],
})
export class StatsModule {}
