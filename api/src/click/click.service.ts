import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Click } from "./entities/click.entity";
import { Url } from "../url/entities/url.entity";

@Injectable()
export class ClickService {
  constructor(
    @InjectRepository(Click) private readonly repo: Repository<Click>,
  ) {}

  /**
   * Log a click: save IP, user-agent, and relation to the URL.
   */
  log(url: Url, ip: string, ua: string) {
    const click = this.repo.create({ url, ip, userAgent: ua });
    return this.repo.save(click);
  }

  /**
   * Return raw daily counts for the last `days` days.
   * Uses Postgres make_interval to safely bind `days`.
   */
  getDailyCounts(urlId: string, days = 30) {
    return this.repo
      .createQueryBuilder("c")
      .select("date_trunc('day', c.createdAt)", "day")
      .addSelect("COUNT(*)", "count")
      .where("c.urlId = :urlId", { urlId })
      .andWhere("c.createdAt >= NOW() - make_interval(days => :days)", { days })
      .groupBy("day")
      .orderBy("day", "ASC")
      .getRawMany<{ day: Date; count: string }>();
  }
}
