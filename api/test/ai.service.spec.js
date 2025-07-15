// test/ai.service.spec.js

// 1) Mock modules before imports
jest.mock("axios");
const axios = require("axios");

const fakeSend = jest.fn().mockResolvedValue({
  response: { text: () => "  result  " },
});
const fakeModel = { startChat: jest.fn(() => ({ sendMessage: fakeSend })) };
const fakeGenAI = { getGenerativeModel: jest.fn(() => fakeModel) };

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn(() => fakeGenAI),
}));

const { AI_Service } = require("../src/ai/ai.service");
const { Logger } = require("@nestjs/common");
const { GoogleGenerativeAI } = require("@google/generative-ai");

describe("AI_Service", () => {
  let aiService;
  let configMock;

  beforeEach(() => {
    // Silence warnings
    jest.spyOn(Logger.prototype, "warn").mockImplementation(() => {});

    // ConfigService mock
    configMock = { get: jest.fn().mockReturnValue("API_KEY") };

    // Instantiate after mocks
    aiService = new AI_Service(configMock);
  });

  afterEach(() => jest.resetAllMocks());

  it("constructor throws if no API key", () => {
    configMock.get.mockReturnValueOnce(undefined);
    expect(() => new AI_Service(configMock)).toThrow(
      "GOOGLE_AI_API_KEY missing",
    );
  });

  it("summarizeUrl() fetches HTML and delegates to generate()", async () => {
    axios.get.mockResolvedValue({ data: "<p>Hi</p>" });
    const spy = jest.spyOn(aiService, "generate").mockResolvedValue("sum");

    const res = await aiService.summarizeUrl("http://x");
    expect(axios.get).toHaveBeenCalledWith("http://x", { timeout: 10000 });
    expect(spy).toHaveBeenCalledWith("Summarize in 2 sentences:\n Hi ");
    expect(res).toBe("sum");
  });

  it("summarizeUrl() returns N/A on fetch error", async () => {
    axios.get.mockRejectedValue(new Error("err"));
    const res = await aiService.summarizeUrl("http://bad");
    expect(Logger.prototype.warn).toHaveBeenCalled();
    expect(res).toBe("N/A");
  });
});
