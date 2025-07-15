import { Module } from "@nestjs/common";
import { AI_Service } from "./ai.service";
import { AIController } from "./ai.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [AI_Service],
  exports: [AI_Service],
  controllers: [AIController],
})
export class AI_Module {}
