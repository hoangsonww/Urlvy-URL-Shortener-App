// web/test/pages/auth/register.spec.js
const React = require("react");
const { render, fireEvent, waitFor } = require("@testing-library/react");
const Register = require("../../pages/auth/register").default;
const { api } = require("../../lib/api");
const { useAuth } = require("../../context/Auth");
const { toast } = require("sonner");
const { useRouter } = require("next/router");

jest.mock("../../lib/api");
jest.mock("../../context/Auth");
jest.mock("sonner");
jest.mock("next/router", () => ({ useRouter: jest.fn() }));

describe("Register (logic only)", () => {
  let loginMock, pushMock;

  beforeEach(() => {
    jest.clearAllMocks();
    loginMock = jest.fn();
    useAuth.mockReturnValue({ login: loginMock });
    pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
  });

  it("errors when fields empty", () => {
    const { getByText } = render(React.createElement(Register));
    fireEvent.click(getByText("Sign Up"));
    expect(toast.error).toHaveBeenCalledWith("All fields are required");
  });

  it("errors when passwords mismatch", () => {
    const { getByPlaceholderText, getByText } = render(
      React.createElement(Register),
    );
    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "1" },
    });
    fireEvent.change(getByPlaceholderText("Confirm password"), {
      target: { value: "2" },
    });
    fireEvent.click(getByText("Sign Up"));
    expect(toast.error).toHaveBeenCalledWith("Passwords do not match");
  });

  it("on success calls login, toast.success & redirect", async () => {
    api.post.mockResolvedValue({ data: { accessToken: "tok123" } });
    const { getByPlaceholderText, getByText } = render(
      React.createElement(Register),
    );

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "u@ex.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "pw" },
    });
    fireEvent.change(getByPlaceholderText("Confirm password"), {
      target: { value: "pw" },
    });
    fireEvent.click(getByText("Sign Up"));

    await waitFor(() => expect(loginMock).toHaveBeenCalledWith("tok123"));
    expect(toast.success).toHaveBeenCalledWith("Account created! Redirecting…");
    expect(pushMock).toHaveBeenCalledWith("/app/links");
  });

  it("on API error shows message", async () => {
    api.post.mockRejectedValue({
      response: { data: { message: "Email used" } },
    });
    const { getByPlaceholderText, getByText } = render(
      React.createElement(Register),
    );
    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "dup@ex.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "pw" },
    });
    fireEvent.change(getByPlaceholderText("Confirm password"), {
      target: { value: "pw" },
    });
    fireEvent.click(getByText("Sign Up"));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Email used"));
  });

  it("on generic failure shows fallback", async () => {
    api.post.mockRejectedValue(new Error("fail"));
    const { getByPlaceholderText, getByText } = render(
      React.createElement(Register),
    );
    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "u@ex.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "pw" },
    });
    fireEvent.change(getByPlaceholderText("Confirm password"), {
      target: { value: "pw" },
    });
    fireEvent.click(getByText("Sign Up"));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Registration failed"),
    );
  });
});
