// test/click.service.spec.js
const { ClickService } = require("../src/click/click.service");

describe("ClickService", () => {
  let clickService;
  let repoMock;
  let qbMock;

  beforeEach(() => {
    // Mock repository methods
    repoMock = {
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    // Mock QueryBuilder chain
    qbMock = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    };
    repoMock.createQueryBuilder.mockReturnValue(qbMock);

    clickService = new ClickService(repoMock);
  });

  describe("log()", () => {
    it("should create and save a click entity", async () => {
      const url = { id: "url1" };
      const ip = "1.2.3.4";
      const ua = "TestAgent";
      const fakeClick = { url, ip, userAgent: ua };

      repoMock.create.mockReturnValue(fakeClick);
      repoMock.save.mockResolvedValue({ ...fakeClick, id: "click1" });

      const result = await clickService.log(url, ip, ua);

      expect(repoMock.create).toHaveBeenCalledWith({ url, ip, userAgent: ua });
      expect(repoMock.save).toHaveBeenCalledWith(fakeClick);
      expect(result).toEqual({ ...fakeClick, id: "click1" });
    });
  });

  describe("getDailyCounts()", () => {
    it("should build and execute the query with default days", async () => {
      const urlId = "abc";
      const rawResult = [
        { day: new Date("2025-07-01"), count: "5" },
        { day: new Date("2025-07-02"), count: "3" },
      ];
      qbMock.getRawMany.mockResolvedValue(rawResult);

      const result = await clickService.getDailyCounts(urlId);

      expect(repoMock.createQueryBuilder).toHaveBeenCalledWith("c");
      expect(qbMock.select).toHaveBeenCalledWith(
        "date_trunc('day', c.createdAt)",
        "day",
      );
      expect(qbMock.addSelect).toHaveBeenCalledWith("COUNT(*)", "count");
      expect(qbMock.where).toHaveBeenCalledWith("c.urlId = :urlId", { urlId });
      expect(qbMock.andWhere).toHaveBeenCalledWith(
        "c.createdAt >= NOW() - make_interval(days => :days)",
        { days: 30 },
      );
      expect(qbMock.groupBy).toHaveBeenCalledWith("day");
      expect(qbMock.orderBy).toHaveBeenCalledWith("day", "ASC");
      expect(qbMock.getRawMany).toHaveBeenCalled();
      expect(result).toBe(rawResult);
    });

    it("should use custom days parameter", async () => {
      const urlId = "xyz";
      const days = 7;
      qbMock.getRawMany.mockResolvedValue([]);

      await clickService.getDailyCounts(urlId, days);

      expect(qbMock.andWhere).toHaveBeenCalledWith(
        "c.createdAt >= NOW() - make_interval(days => :days)",
        { days },
      );
    });
  });
});
