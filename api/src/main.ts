import { randomUUID } from "crypto";
if (!globalThis.crypto) {
  // polyfill for swagger-ui’s use of crypto.randomUUID
  // @ts-ignore
  globalThis.crypto = { randomUUID };
}

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cfg = app.get(ConfigService);

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS
  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Redirect root → /docs
  app.use((req: any, res: any, next: any) => {
    if (req.path === "/") {
      return res.redirect(302, "/docs");
    }
    next();
  });

  // Build OpenAPI spec
  const openApi = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("Urlvy API")
      .setDescription("AI-powered URL shortener backend")
      .setVersion("1.1.0")
      .addBearerAuth()
      .build(),
  );

  // Serve swagger-ui entirely from CDN, using jsDelivr raw PNG
  SwaggerModule.setup("docs", app, openApi, {
    swaggerOptions: {
      url: "/docs-json",
    },
    customCssUrl:
      "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.12.0/swagger-ui.css",
    customJs: [
      "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.12.0/swagger-ui-bundle.js",
      "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.12.0/swagger-ui-standalone-preset.js",
    ],
    customfavIcon:
      "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.12.0/favicon-32x32.png",
    customSiteTitle: "Urlvy API Docs", // ← sets the browser tab title
  });

  // Log DB URL
  console.log("▶️  Connecting to DB at:", cfg.get<string>("databaseUrl"));

  // Start server
  const port = cfg.getOrThrow<number>("port");
  await app.listen(port);
  console.log(`🚀  Urlvy API listening at http://localhost:${port}/docs`);
}

bootstrap();
