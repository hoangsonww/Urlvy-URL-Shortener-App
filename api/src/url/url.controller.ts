// src/url/url.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Patch,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
  Headers,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Request, Response } from "express";

import { UrlService } from "./url.service";
import { ClickService } from "../click/click.service";
import { CreateUrlDto } from "./dto/create-url.dto";
import { UpdateUrlDto } from "./dto/update-url.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("urls")
@Controller("urls")
export class UrlController {
  constructor(
    private readonly urls: UrlService,
    private readonly clicks: ClickService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new short URL" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ description: "Short URL created" })
  create(@Body() dto: CreateUrlDto) {
    return this.urls.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Get all URLs" })
  @ApiOkResponse({ description: "All URLs returned" })
  findAll() {
    return this.urls.findAll();
  }

  /** JSON details endpoint */
  @Get(":slug/details")
  @ApiOperation({ summary: "Get URL details (JSON)" })
  @ApiOkResponse({ description: "URL details returned" })
  async details(
    @Param("slug") slug: string,
    @Ip() ip: string,
    @Headers("user-agent") ua: string,
  ) {
    const url = await this.urls.findBySlug(slug);
    this.clicks.log(url, ip, ua);
    return { data: url };
  }

  /** Browser redirect, or JSON if requested */
  @Get(":slug")
  @Redirect(undefined, 302)
  @ApiOperation({ summary: "Redirect to the destination URL" })
  async redirect(
    @Param("slug") slug: string,
    @Ip() ip: string,
    @Headers("user-agent") ua: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const url = await this.urls.findBySlug(slug);
    this.clicks.log(url, ip, ua);

    if (req.headers.accept?.includes("application/json")) {
      return res.json({ data: url });
    }

    return { url: url.destination };
  }

  @Patch(":slug")
  @ApiOperation({ summary: "Update a URL by slug" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: "URL updated" })
  update(@Param("slug") slug: string, @Body() dto: UpdateUrlDto) {
    return this.urls.update(slug, dto);
  }

  @Delete(":slug")
  @ApiOperation({ summary: "Delete a URL by slug" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: "URL deleted" })
  remove(@Param("slug") slug: string) {
    return this.urls.delete(slug);
  }
}
