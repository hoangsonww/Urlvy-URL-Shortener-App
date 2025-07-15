import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import slugid from "slugid";

import { Url } from "./entities/url.entity";
import { CreateUrlDto, UpdateUrlDto } from "./dto";
import { AI_Service } from "../ai/ai.service";

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url) private readonly repo: Repository<Url>,
    private readonly ai: AI_Service,
  ) {}

  /**
   * Create a new short URL.
   * If dto.customSlug is provided, use it; otherwise generate a random one.
   * Throws ConflictException if the slug is already taken.
   */
  async create(dto: CreateUrlDto): Promise<Url> {
    const slug = dto.customSlug?.trim() || slugid.nice();

    // Check for slug collision
    const existing = await this.repo.findOneBy({ slug });
    if (existing) {
      throw new ConflictException(`Slug '${slug}' is already in use`);
    }

    // Build and save the entity
    const url = this.repo.create({
      slug,
      destination: dto.destination,
    });
    const saved = await this.repo.save(url);

    // Fire-and-forget AI summarization
    this.ai
      .summarizeUrl(dto.destination)
      .then((summary) => {
        // Patch the summary once available
        return this.repo.update({ id: saved.id }, { summary });
      })
      .catch((err) => {
        console.error("AI summarization error for", dto.destination, err);
      });

    return saved;
  }

  /**
   * Return all Urls, including the clicks relation.
   */
  findAll(): Promise<Url[]> {
    return this.repo.find({ relations: ["clicks"] });
  }

  /**
   * Look up a Url by slug.
   * Throws NotFoundException if none found.
   */
  async findBySlug(slug: string): Promise<Url> {
    const url = await this.repo.findOne({
      where: { slug },
      relations: ["clicks"], // ← ensure clicks are loaded
    });
    if (!url) {
      throw new NotFoundException(`No URL found for slug '${slug}'`);
    }
    return url;
  }

  /**
   * Update the slug and/or destination.
   * If dto.customSlug is set, rename the slug (unless that slug is taken).
   */
  async update(slug: string, dto: UpdateUrlDto): Promise<Url> {
    const url = await this.findBySlug(slug);

    // If renaming slug
    if (dto.customSlug && dto.customSlug !== slug) {
      const exists = await this.repo.findOneBy({ slug: dto.customSlug });
      if (exists) {
        throw new ConflictException(
          `Slug '${dto.customSlug}' is already in use`,
        );
      }
      url.slug = dto.customSlug.trim();
    }

    // Update destination if provided
    if (dto.destination) {
      url.destination = dto.destination;
    }

    return this.repo.save(url);
  }

  /**
   * Delete a Url by slug.
   */
  async delete(slug: string): Promise<void> {
    await this.repo.delete({ slug });
  }
}
