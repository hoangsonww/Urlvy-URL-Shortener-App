import { ApiProperty } from "@nestjs/swagger";
import { IsObject } from "class-validator";

export class ChatStatsDto {
  @ApiProperty({
    description:
      "An object containing aggregated statistics for the link, e.g. daily counts, device split, etc.",
    example: {
      dailyTrend: [
        { day: "07-01", count: 12 },
        { day: "07-02", count: 8 } /* ... */,
      ],
      deviceSplit: [
        { name: "Desktop", value: 85 },
        { name: "Mobile", value: 47 },
      ],
      hourly: [{ hour: "00:00", count: 5 } /* ... */],
      // other pre-computed stats...
    },
  })
  @IsObject()
  stats!: Record<string, any>;
}
