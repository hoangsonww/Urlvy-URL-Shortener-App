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
  private readonly apiKey: string;
  private readonly modelsCacheTtlMs = 5 * 60 * 1000;
  private modelsCache: { models: string[]; expiresAt: number } | null = null;
  private modelRotationIndex = 0;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>("googleApiKey");
    if (!apiKey) throw new Error("GOOGLE_AI_API_KEY missing");
    this.apiKey = apiKey;
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
    const generationConfig: GenerationConfig = {
      temperature: 0.3,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 8192,
    };
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];
    const models = await this.listGeminiModels();
    if (!models.length) {
      throw new Error("No Gemini generation models available");
    }
    const startIndex = this.modelRotationIndex % models.length;
    let lastError: unknown;

    for (let offset = 0; offset < models.length; offset += 1) {
      const modelName = models[(startIndex + offset) % models.length];
      try {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const chat = model.startChat({
          generationConfig,
          safetySettings,
        });
        const result = await chat.sendMessage(prompt);
        const raw = result.response?.text?.();
        this.modelRotationIndex = (startIndex + offset + 1) % models.length;
        return raw ? raw.trim() : "";
      } catch (err) {
        lastError = err;
        this.logger.warn(`Gemini model ${modelName} failed: ${err}`);
      }
    }

    this.modelRotationIndex = (startIndex + 1) % models.length;
    if (lastError instanceof Error) {
      throw lastError;
    }
    throw new Error("All Gemini models failed");
  }

  private async listGeminiModels(): Promise<string[]> {
    const now = Date.now();
    if (this.modelsCache && this.modelsCache.expiresAt > now) {
      return this.modelsCache.models;
    }

    try {
      const response = await axios.get<{
        models?: Array<{
          name?: string;
          supportedGenerationMethods?: string[];
        }>;
      }>("https://generativelanguage.googleapis.com/v1/models", {
        params: { key: this.apiKey },
        timeout: 10_000,
      });
      const models =
        response.data.models
          ?.filter((model) => model.name?.startsWith("models/gemini-"))
          .filter((model) => !model.name?.includes("-pro"))
          .filter((model) => !model.name?.includes("embedding"))
          .filter((model) =>
            model.supportedGenerationMethods?.includes("generateContent"),
          )
          .map((model) => model.name?.replace(/^models\//, ""))
          .filter((model): model is string => Boolean(model)) ?? [];

      if (!models.length) {
        throw new Error("No Gemini generation models available");
      }

      this.modelsCache = {
        models,
        expiresAt: now + this.modelsCacheTtlMs,
      };
      return models;
    } catch (err) {
      if (this.modelsCache?.models.length) {
        this.logger.warn(
          "Failed to refresh Gemini model list, using cached list.",
        );
        return this.modelsCache.models;
      }
      throw err;
    }
  }
}

/** crude HTML stripper */
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ");
}
