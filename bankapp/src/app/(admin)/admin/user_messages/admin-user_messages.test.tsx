import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { notFound } from "next/navigation";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";
import { AdminMessageModule } from "@/src/components/AdminMessageModule";
import AdminCurrentUserMessages from "./page";

jest.mock("@/src/lib/admin-api-server", () => ({
  adminApiServerFetch: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("../../../../components/AdminPageHeader", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/src/components/AdminMessageModule", () => ({
  AdminMessageModule: jest.fn(() => null),
}));

jest.mock("@/src/app/actions/handleReadMessageActions", () => ({
  handleReadMessage: jest.fn(),
}));

jest.mock("@/src/app/actions/editFlaggedMessageStatus", () => ({
  editFlaggedMessageStatus: jest.fn(),
}));

jest.mock("@/src/app/actions/adminMessageDeleteAction", () => ({
  handleAdminMessageDeletion: jest.fn(),
}));

describe("AdminCurrentUserMessages page", () => {
  const userId = "42";
  const messages = [
    {
      message_id: 1,
      customer_id: 42,
      msg_subject: "Account review",
      msg_status: "normal",
      msg_body: "Your account review is complete.",
      msg_created_by: "Support",
      is_read: false,
      flagged: false,
      sent_at: "2026-03-10T09:30:00.000Z",
      first_name: "Ava",
      last_name: "Stone",
      dob: "1992-05-10",
    },
    {
      message_id: 2,
      customer_id: 42,
      msg_subject: "Payment question",
      msg_status: "urgent",
      msg_body: "Please contact us about your payment.",
      msg_created_by: "Support",
      is_read: true,
      flagged: false,
      sent_at: "2026-03-11T09:30:00.000Z",
      first_name: "Ava",
      last_name: "Stone",
      dob: "1992-05-10",
    },
  ];
  const users = [
    {
      customer_id: 42,
      first_name: "Ava",
      last_name: "Stone",
      email: "ava@example.com",
      phone: "+447700900042",
      customer_address: "42 Market Street",
      dob: "1992-05-10",
      created_at: "2025-01-10",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.mocked(adminApiServerFetch).mockResolvedValueOnce(messages);
    jest.mocked(adminApiServerFetch).mockResolvedValueOnce(users);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderPage = async () => {
    const page = await AdminCurrentUserMessages({
      searchParams: Promise.resolve({ userId }),
    });

    return render(page);
  };

  it("fetches and displays messages for the selected user", async () => {
    await renderPage();

    expect(adminApiServerFetch).toHaveBeenNthCalledWith(
      1,
      `${process.env.BACK_END_URL}/messages/user/${userId}`,
      { cache: "no-store", next: { tags: ["userMessages"] } },
    );
    expect(adminApiServerFetch).toHaveBeenNthCalledWith(
      2,
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/users`,
    );
    expect(await screen.findByText("Account review")).toBeInTheDocument();
    expect(screen.getByText("Payment question")).toBeInTheDocument();
    expect(
      screen.getByText("Select a message from the list to view details"),
    ).toBeInTheDocument();
  });

  it("shows a selected message and its recipient details", async () => {
    const user = userEvent.setup();
    await renderPage();

    await user.click(await screen.findByText("Account review"));

    expect(
      screen.getByText("Your account review is complete."),
    ).toBeInTheDocument();
    expect(screen.getByText(/Sent to: Ava Stone/)).toBeInTheDocument();
  });

  it("opens the message module for the selected user", async () => {
    const user = userEvent.setup();
    await renderPage();

    await user.click(screen.getByRole("button", { name: "📨" }));

    expect(jest.mocked(AdminMessageModule).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        userId,
        allUsersData: users,
      }),
    );
  });

  it("returns not found when no user id is provided", async () => {
    await expect(
      AdminCurrentUserMessages({
        searchParams: Promise.resolve({ userId: "" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
    expect(adminApiServerFetch).not.toHaveBeenCalled();
  });
});
