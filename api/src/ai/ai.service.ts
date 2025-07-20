import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerationConfig,
} from "@google/generative-ai";
import axios from "axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AI_Service {
  private readonly logger = new Logger(AI_Service.name);
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>("googleApiKey");
    if (!apiKey) throw new Error("GOOGLE_AI_API_KEY missing");
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async summarizeUrl(target: string): Promise<string> {
    try {
      const page = await axios.get<string>(target, { timeout: 10_000 });
      const text = stripHtml(page.data).slice(0, 10_000); // basic truncation
      return await this.generate(`Summarize in 2 sentences:\n${text}`);
    } catch (err) {
      this.logger.warn(`Failed to fetch ${target}: ${err}`);
      return "N/A";
    }
  }

  async generate(prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
    });
    const generationConfig: GenerationConfig = {
      temperature: 0.3,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 8192,
    };
    const chat = model.startChat({
      generationConfig,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });
    const result = await chat.sendMessage(prompt);
    const raw = result.response?.text?.();
    return raw ? raw.trim() : "";
  }
}

/** crude HTML stripper */
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ");
}
