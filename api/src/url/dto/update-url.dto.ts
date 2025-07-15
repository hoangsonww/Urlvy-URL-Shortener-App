import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl, Length } from "class-validator";

export class UpdateUrlDto {
  @ApiPropertyOptional({ example: "https://example.com/updated" })
  @IsOptional()
  @IsUrl()
  destination?: string;

  @ApiPropertyOptional({ example: "new-custom-slug" })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  customSlug?: string;
}
