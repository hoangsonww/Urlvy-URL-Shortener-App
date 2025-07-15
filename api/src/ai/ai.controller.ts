// src/ai/ai.controller.ts
import { Controller, Post, Body, Param, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AI_Service } from "./ai.service";
import { ChatStatsDto } from "./dto/chat-stats.dto";

@ApiTags("ai")
@Controller("urls/:slug/chat")
export class AIController {
  constructor(private readonly ai: AI_Service) {}

  @Post()
  @ApiOperation({
    summary: "Have the AI analyze and explain your link statistics",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: "A conversational summary of the provided stats",
    schema: {
      example: {
        reply:
          "Over the past 30 days, your link has seen a steady uptick in desktop clicks...",
      },
    },
  })
  async chatStats(@Param("slug") slug: string, @Body() dto: ChatStatsDto) {
    // Build a system prompt to give the bot an identity
    const systemPrompt = `
You are UrlvyStatsBot, an expert data analyst for Urlvy links.
Your user has provided you with pre-computed stats for link “${slug}”.
Explain trends, highlight anomalies, and suggest improvements in plain English.
Respond conversationally.
    `.trim();

    // Turn the stats object into a readable bullet list
    const statsText = Object.entries(dto.stats)
      .map(([key, val]) => `• ${key}: ${JSON.stringify(val)}`)
      .join("\n");

    const fullPrompt = `${systemPrompt}

Here are the stats:
${statsText}

Please analyze and explain.`;

    const reply = await this.ai.generate(fullPrompt);
    return { reply };
  }
}
