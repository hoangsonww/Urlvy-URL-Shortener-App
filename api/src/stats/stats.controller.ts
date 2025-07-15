// src/stats/stats.controller.ts

import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import { ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ClickService } from "../click/click.service";
import { UrlService } from "../url/url.service";

@ApiTags("stats")
@Controller("stats")
export class StatsController {
  constructor(
    private readonly clicks: ClickService,
    private readonly urls: UrlService,
  ) {}

  @Get(":slug/daily")
  @ApiOkResponse({ description: "Daily click counts for the given slug" })
  @ApiQuery({
    name: "days",
    type: Number,
    required: false,
    description: "Number of days to look back",
    example: 30,
  })
  async daily(
    @Param("slug") slug: string,
    @Query(
      "days",
      // Apply default value of '30' before parsing to int
      new DefaultValuePipe("30"),
      ParseIntPipe,
    )
    days: number,
  ) {
    // Verify URL exists
    const url = await this.urls.findBySlug(slug);
    // Return array of { day: string; count: number }
    return this.clicks.getDailyCounts(url.id, days);
  }
}
