// test/url.service.spec.js
jest.mock("slugid", () => ({ nice: () => "randomSlug" }));

const { UrlService } = require("../src/url/url.service");
const { ConflictException, NotFoundException } = require("@nestjs/common");
const slugid = require("slugid");

describe("UrlService", () => {
  let urlService;
  let repoMock;
  let aiMock;

  beforeEach(() => {
    repoMock = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };
    aiMock = {
      summarizeUrl: jest.fn().mockResolvedValue("summary text"),
    };

    urlService = new UrlService(repoMock, aiMock);
  });

  describe("create()", () => {
    it("generates slug via slugid when no customSlug and saves", async () => {
      const dto = { destination: "http://dest.com" };
      repoMock.findOneBy.mockResolvedValue(null);
      const entity = { slug: "randomSlug", destination: dto.destination };
      repoMock.create.mockReturnValue(entity);
      repoMock.save.mockResolvedValue({ id: "1", ...entity });
      // call
      const result = await urlService.create(dto);
      expect(repoMock.findOneBy).toHaveBeenCalledWith({ slug: "randomSlug" });
      expect(repoMock.create).toHaveBeenCalledWith({
        slug: "randomSlug",
        destination: dto.destination,
      });
      expect(repoMock.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual({
        id: "1",
        slug: "randomSlug",
        destination: dto.destination,
      });
      // ensure AI summarization fired
      expect(aiMock.summarizeUrl).toHaveBeenCalledWith(dto.destination);
    });

    it("throws ConflictException if slug exists", async () => {
      const dto = { customSlug: "taken", destination: "url" };
      repoMock.findOneBy.mockResolvedValue({ slug: "taken" });
      await expect(urlService.create(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe("findAll()", () => {
    it("returns all URLs with relations", async () => {
      const fake = [{ id: "1" }];
      repoMock.find.mockResolvedValue(fake);
      const res = await urlService.findAll();
      expect(repoMock.find).toHaveBeenCalledWith({ relations: ["clicks"] });
      expect(res).toBe(fake);
    });
  });

  describe("findBySlug()", () => {
    it("returns URL when found", async () => {
      const url = { id: "1", slug: "s", clicks: [] };
      repoMock.findOne.mockResolvedValue(url);
      const res = await urlService.findBySlug("s");
      expect(repoMock.findOne).toHaveBeenCalledWith({
        where: { slug: "s" },
        relations: ["clicks"],
      });
      expect(res).toBe(url);
    });
    it("throws NotFoundException when not found", async () => {
      repoMock.findOne.mockResolvedValue(null);
      await expect(urlService.findBySlug("x")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe("update()", () => {
    it("renames slug if customSlug provided and not taken", async () => {
      const old = { id: "1", slug: "old", destination: "d" };
      repoMock.findOne.mockResolvedValue(old);
      repoMock.findOneBy.mockResolvedValue(null); // new slug free
      repoMock.save.mockResolvedValue({ ...old, slug: "new" });
      const dto = { customSlug: "new" };
      const res = await urlService.update("old", dto);
      expect(repoMock.findOne).toHaveBeenCalled();
      expect(repoMock.findOneBy).toHaveBeenCalledWith({ slug: "new" });
      expect(repoMock.save).toHaveBeenCalledWith({ ...old, slug: "new" });
      expect(res.slug).toBe("new");
    });

    it("throws ConflictException if new slug taken", async () => {
      repoMock.findOne.mockResolvedValue({ id: "1", slug: "old" });
      repoMock.findOneBy.mockResolvedValue({ slug: "exists" });
      await expect(
        urlService.update("old", { customSlug: "exists" }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it("updates destination if provided", async () => {
      const old = { id: "1", slug: "s", destination: "d1" };
      repoMock.findOne.mockResolvedValue(old);
      repoMock.findOneBy.mockResolvedValue(null);
      repoMock.save.mockResolvedValue({ ...old, destination: "d2" });
      const res = await urlService.update("s", { destination: "d2" });
      expect(repoMock.save).toHaveBeenCalledWith({ ...old, destination: "d2" });
      expect(res.destination).toBe("d2");
    });
  });

  describe("delete()", () => {
    it("calls repo.delete with slug", async () => {
      await urlService.delete("slug1");
      expect(repoMock.delete).toHaveBeenCalledWith({ slug: "slug1" });
    });
  });
});
