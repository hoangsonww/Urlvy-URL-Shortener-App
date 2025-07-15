const { AuthController } = require("../src/auth/auth.controller");

describe("AuthController", () => {
  let authController;
  let mockAuthService;
  let mockUserService;

  beforeEach(() => {
    mockAuthService = {
      login: jest.fn((user) => ({ token: "tok:" + user.id })),
      validateUser: jest.fn((email, pwd) => ({ id: "uid", email })),
    };
    mockUserService = {
      create: jest.fn((email, pwd) => Promise.resolve({ id: "nid", email })),
    };
    authController = new AuthController(mockAuthService, mockUserService);
  });

  it("register → creates user and returns token", async () => {
    const dto = { email: "a@b.com", password: "pw" };
    const res = await authController.register(dto);
    expect(mockUserService.create).toHaveBeenCalledWith(
      dto.email,
      dto.password,
    );
    expect(mockAuthService.login).toHaveBeenCalledWith({
      id: "nid",
      email: dto.email,
    });
    expect(res).toEqual({ token: "tok:nid" });
  });

  it("login → validates and returns token", async () => {
    const dto = { email: "x@y.com", password: "pw2" };
    const res = await authController.login(dto);
    expect(mockAuthService.validateUser).toHaveBeenCalledWith(
      dto.email,
      dto.password,
    );
    expect(mockAuthService.login).toHaveBeenCalledWith({
      id: "uid",
      email: dto.email,
    });
    expect(res).toEqual({ token: "tok:uid" });
  });

  it("profile → returns req.user", () => {
    const req = { user: { id: "u1", email: "u1@d.com" } };
    expect(authController.profile(req)).toEqual(req.user);
  });
});
