import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import UserProfile from "./UserProfile";

global.fetch = jest.fn();

describe("UserProfile Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", async () => {
    fetch.mockImplementationOnce(() => new Promise(() => {})); // Mock fetch to return a pending promise
    render(<UserProfile />);
    expect(screen.getByTestId("loading")).toHaveTextContent("Loading...");
  });

  test("renders user data on successful fetch", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: "Leanne Graham", email: "Sincere@april.biz" }),
    });

    render(<UserProfile />);

    await screen.findByTestId("user-name");

    expect(screen.getByTestId("user-name")).toHaveTextContent("Leanne Graham");
    expect(screen.getByTestId("user-email")).toHaveTextContent("Sincere@april.biz");
  });

  test("renders error message on API failure", async () => {
    fetch.mockRejectedValueOnce(new Error("Failed to fetch user"));

    render(<UserProfile />);

    await screen.findByTestId("error");

    expect(screen.getByTestId("error")).toHaveTextContent("Failed to fetch user");
  });

  test("updates user data on edit button click", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: "Leanne Graham", email: "Sincere@april.biz" }),
    });

    render(<UserProfile />);

    await screen.findByTestId("user-name");

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: "Updated Name", email: "updated@example.com" }),
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("edit-btn"));
      fireEvent.change(screen.getByTestId("user-name-input"), { target: { value: "Updated Name" } });
      fireEvent.change(screen.getByTestId("user-email-input"), { target: { value: "updated@example.com" } });
      fireEvent.click(screen.getByTestId("save-btn"));
    });

    await waitFor(() => expect(screen.getByTestId("user-name")).toHaveTextContent("Updated Name"));
    expect(screen.getByTestId("user-email")).toHaveTextContent("updated@example.com");
  });

  test("deletes user data on delete button click", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: "Leanne Graham", email: "Sincere@april.biz" }),
    });

    render(<UserProfile />);

    await screen.findByTestId("user-name");

    fetch.mockResolvedValueOnce({ ok: true });

    await act(async () => {
      fireEvent.click(screen.getByTestId("delete-btn"));
    });

    await waitFor(() => expect(screen.queryByTestId("user-name")).toBeNull());
    expect(screen.getByTestId("message")).toHaveTextContent("User deleted successfully");
  });

  test("shows error if edit fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: "Leanne Graham", email: "Sincere@april.biz" }),
    });

    render(<UserProfile />);

    await screen.findByTestId("user-name");

    fetch.mockRejectedValueOnce(new Error("Failed to update user"));

    await act(async () => {
      fireEvent.click(screen.getByTestId("edit-btn"));
      fireEvent.change(screen.getByTestId("user-name-input"), { target: { value: "Updated Name" } });
      fireEvent.change(screen.getByTestId("user-email-input"), { target: { value: "updated@example.com" } });
      fireEvent.click(screen.getByTestId("save-btn"));
    });

    await waitFor(() => expect(screen.getByTestId("error")).toHaveTextContent("Failed to update user"));
  });

  test("shows error if delete fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: "Leanne Graham", email: "Sincere@april.biz" }),
    });

    render(<UserProfile />);

    await screen.findByTestId("user-name");

    fetch.mockRejectedValueOnce(new Error("Failed to delete user"));

    await act(async () => {
      fireEvent.click(screen.getByTestId("delete-btn"));
    });

    await waitFor(() => expect(screen.getByTestId("error")).toHaveTextContent("Failed to delete user"));
  });
});
