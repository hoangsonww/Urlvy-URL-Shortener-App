import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Click } from "./entities/click.entity";
import { ClickService } from "./click.service";

@Module({
  imports: [TypeOrmModule.forFeature([Click])],
  providers: [ClickService],
  exports: [ClickService],
})
export class ClickModule {}
