import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl, Length } from "class-validator";

export class CreateUrlDto {
  @ApiProperty({ example: "https://example.com/article" })
  @IsUrl()
  destination!: string;

  @ApiPropertyOptional({ example: "my-custom-slug" })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  customSlug?: string;
}
