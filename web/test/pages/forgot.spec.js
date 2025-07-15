// test/pages/auth/forgot.spec.js
const React = require("react");
const { render, fireEvent, waitFor } = require("@testing-library/react");
const ForgotPasswordPage = require("../../pages/auth/forgot").default;
const { api } = require("../../lib/api");
const { toast } = require("sonner");
const { useRouter } = require("next/router");

jest.mock("../../lib/api");
jest.mock("sonner");
jest.mock("next/router", () => ({ useRouter: jest.fn() }));

describe("ForgotPasswordPage (logic only)", () => {
  let pushMock;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows error if email empty on verify", () => {
    const { getByRole } = render(React.createElement(ForgotPasswordPage));
    fireEvent.click(getByRole("button", { name: "Verify Email" }));
    expect(toast.error).toHaveBeenCalledWith("Please enter your email");
  });

  it("successful email verification shows reset step", async () => {
    api.post.mockResolvedValueOnce({}); // for /auth/forgot
    const { getByPlaceholderText, getByRole, queryByRole } = render(
      React.createElement(ForgotPasswordPage),
    );

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "u@e.com" },
    });
    fireEvent.click(getByRole("button", { name: "Verify Email" }));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Email verified — enter a new password",
      ),
    );

    // now the Reset button should be present
    expect(queryByRole("button", { name: "Reset Password" })).toBeTruthy();
  });

  it("failed email verification shows API message", async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: "Not found" } },
    });
    const { getByPlaceholderText, getByRole } = render(
      React.createElement(ForgotPasswordPage),
    );

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "no@one.com" },
    });
    fireEvent.click(getByRole("button", { name: "Verify Email" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Not found"));
  });

  it("shows fallback on verify failure without message", async () => {
    api.post.mockRejectedValueOnce(new Error("fail"));
    const { getByPlaceholderText, getByRole } = render(
      React.createElement(ForgotPasswordPage),
    );

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "u@e.com" },
    });
    fireEvent.click(getByRole("button", { name: "Verify Email" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to verify email"),
    );
  });

  it("errors on reset if passwords empty or mismatched", async () => {
    api.post.mockResolvedValueOnce({}); // verify succeeds

    const { getByPlaceholderText, getByRole } = render(
      React.createElement(ForgotPasswordPage),
    );
    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "u@e.com" },
    });
    fireEvent.click(getByRole("button", { name: "Verify Email" }));
    await waitFor(() => expect(toast.success).toHaveBeenCalled());

    // no pw entered
    fireEvent.click(getByRole("button", { name: "Reset Password" }));
    expect(toast.error).toHaveBeenCalledWith("Please enter a new password");

    // mismatch
    fireEvent.change(getByPlaceholderText("New password"), {
      target: { value: "a" },
    });
    fireEvent.change(getByPlaceholderText("Confirm new password"), {
      target: { value: "b" },
    });
    fireEvent.click(getByRole("button", { name: "Reset Password" }));
    expect(toast.error).toHaveBeenCalledWith("Passwords must match");
  });

  it("successful reset shows toast and redirects after timeout", async () => {
    // first call for verify, second for reset
    api.post
      .mockResolvedValueOnce({}) // /auth/forgot
      .mockResolvedValueOnce({}); // /auth/reset

    const { getByPlaceholderText, getByRole } = render(
      React.createElement(ForgotPasswordPage),
    );
    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "u@e.com" },
    });
    fireEvent.click(getByRole("button", { name: "Verify Email" }));
    await waitFor(() => expect(toast.success).toHaveBeenCalled());

    fireEvent.change(getByPlaceholderText("New password"), {
      target: { value: "pass" },
    });
    fireEvent.change(getByPlaceholderText("Confirm new password"), {
      target: { value: "pass" },
    });
    fireEvent.click(getByRole("button", { name: "Reset Password" }));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Password reset! Redirecting to login…",
      ),
    );

    jest.advanceTimersByTime(1000);
    expect(pushMock).toHaveBeenCalledWith("/auth/login");
  });

  it("reset failure shows API message", async () => {
    api.post
      .mockResolvedValueOnce({}) // /auth/forgot
      .mockRejectedValueOnce({ response: { data: { message: "Bad reset" } } });

    const { getByPlaceholderText, getByRole } = render(
      React.createElement(ForgotPasswordPage),
    );
    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "u@e.com" },
    });
    fireEvent.click(getByRole("button", { name: "Verify Email" }));
    await waitFor(() => expect(toast.success).toHaveBeenCalled());

    fireEvent.change(getByPlaceholderText("New password"), {
      target: { value: "p" },
    });
    fireEvent.change(getByPlaceholderText("Confirm new password"), {
      target: { value: "p" },
    });
    fireEvent.click(getByRole("button", { name: "Reset Password" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Bad reset"));
  });

  it("reset failure without message shows fallback", async () => {
    api.post
      .mockResolvedValueOnce({}) // /auth/forgot
      .mockRejectedValueOnce(new Error("fail"));

    const { getByPlaceholderText, getByRole } = render(
      React.createElement(ForgotPasswordPage),
    );
    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "u@e.com" },
    });
    fireEvent.click(getByRole("button", { name: "Verify Email" }));
    await waitFor(() => expect(toast.success).toHaveBeenCalled());

    fireEvent.change(getByPlaceholderText("New password"), {
      target: { value: "p" },
    });
    fireEvent.change(getByPlaceholderText("Confirm new password"), {
      target: { value: "p" },
    });
    fireEvent.click(getByRole("button", { name: "Reset Password" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Reset failed"),
    );
  });
});
