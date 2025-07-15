// test/pages/auth/login.spec.js
const React = require("react");
const { render, fireEvent, waitFor } = require("@testing-library/react");
const Login = require("../../pages/auth/login").default;
const { api } = require("../../lib/api");
const { useAuth } = require("../../context/Auth");
const { useRouter } = require("next/router");

jest.mock("../../lib/api");
jest.mock("../../context/Auth");
jest.mock("next/router", () => ({ useRouter: jest.fn() }));

describe("Login (logic only)", () => {
  let loginMock, pushMock;

  beforeEach(() => {
    jest.clearAllMocks();
    // auth hook
    loginMock = jest.fn();
    useAuth.mockReturnValue({ login: loginMock });
    // router
    pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
  });

  it("on success calls login and redirects", async () => {
    api.post.mockResolvedValue({ data: { accessToken: "token123" } });
    const { getByPlaceholderText, getByText } = render(
      React.createElement(Login),
    );

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "user@ex.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "pw" },
    });
    fireEvent.click(getByText("Enter"));

    await waitFor(() => expect(loginMock).toHaveBeenCalledWith("token123"));
    expect(pushMock).toHaveBeenCalledWith("/app/links");
  });

  it("displays API error message when provided", async () => {
    api.post.mockRejectedValue({
      response: { data: { message: "Bad creds" } },
    });
    const { getByPlaceholderText, getByText, findByText } = render(
      React.createElement(Login),
    );

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "user@ex.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "pw" },
    });
    fireEvent.click(getByText("Enter"));

    expect(await findByText("Bad creds")).toBeTruthy();
  });

  it("displays fallback error on generic failure", async () => {
    api.post.mockRejectedValue(new Error("network error"));
    const { getByPlaceholderText, getByText, findByText } = render(
      React.createElement(Login),
    );

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "user@ex.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "pw" },
    });
    fireEvent.click(getByText("Enter"));

    expect(await findByText("Invalid credentials")).toBeTruthy();
  });
});
