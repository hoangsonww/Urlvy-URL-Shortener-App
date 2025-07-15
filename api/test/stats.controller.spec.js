// test/stats.controller.spec.js
const { StatsController } = require("../src/stats/stats.controller");
const { DefaultValuePipe, ParseIntPipe } = require("@nestjs/common");

describe("StatsController", () => {
  let statsController;
  let clickServiceMock;
  let urlServiceMock;

  beforeEach(() => {
    clickServiceMock = {
      getDailyCounts: jest.fn(),
    };
    urlServiceMock = {
      findBySlug: jest.fn(),
    };
    statsController = new StatsController(clickServiceMock, urlServiceMock);
  });

  it("daily() returns counts with custom days", async () => {
    const slug = "custom-slug";
    const days = 7;
    const urlObj = { id: "url2" };
    const expected = [{ day: "2025-07-05", count: "2" }];

    urlServiceMock.findBySlug.mockResolvedValue(urlObj);
    clickServiceMock.getDailyCounts.mockResolvedValue(expected);

    const result = await statsController.daily(slug, days);

    expect(urlServiceMock.findBySlug).toHaveBeenCalledWith(slug);
    expect(clickServiceMock.getDailyCounts).toHaveBeenCalledWith("url2", days);
    expect(result).toBe(expected);
  });
});
