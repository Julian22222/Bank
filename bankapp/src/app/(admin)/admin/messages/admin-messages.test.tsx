import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";
import { AdminMessageModule } from "@/src/components/AdminMessageModule";
import AdminMessages from "./page";

jest.mock("@/src/lib/admin-api-server", () => ({
  adminApiServerFetch: jest.fn(),
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

describe("AdminMessages page", () => {
  const messages = [
    {
      message_id: 1,
      customer_id: 7,
      msg_subject: "Account review",
      msg_status: "normal",
      msg_body: "Your account review is complete.",
      msg_created_by: "Support",
      is_read: false,
      sent_at: "2026-03-10T09:30:00.000Z",
      first_name: "Ava",
      last_name: "Stone",
      dob: "1992-05-10",
    },
    {
      message_id: 2,
      customer_id: 8,
      msg_subject: "Payment question",
      msg_status: "urgent",
      msg_body: "Please contact us about your payment.",
      msg_created_by: "Support",
      is_read: true,
      sent_at: "2026-03-11T09:30:00.000Z",
      first_name: "Noah",
      last_name: "Reed",
      dob: "1988-11-20",
    },
  ];

  const users = [
    {
      customer_id: 7,
      first_name: "Ava",
      last_name: "Stone",
      email: "ava@example.com",
      phone: "+447700900007",
      customer_address: "7 Market Street",
      dob: "1992-05-10",
      created_at: "2025-01-10",
    },
    {
      customer_id: 8,
      first_name: "Noah",
      last_name: "Reed",
      email: "noah@example.com",
      phone: "+447700900008",
      customer_address: "8 Market Street",
      dob: "1988-11-20",
      created_at: "2025-02-11",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest
      .mocked(adminApiServerFetch)
      .mockResolvedValueOnce(messages)
      .mockResolvedValueOnce(users);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderPage = async () => render(await AdminMessages());

  it("fetches messages and users and displays the message list", async () => {
    await renderPage();

    expect(adminApiServerFetch).toHaveBeenNthCalledWith(
      1,
      `${process.env.BACK_END_URL}/messages`,
      { cache: "no-store", next: { tags: ["allUsersMessages"] } },
    );
    expect(adminApiServerFetch).toHaveBeenNthCalledWith(
      2,
      `${process.env.BACK_END_URL}/users`,
      { cache: "no-store", next: { tags: ["allUsers"] } },
    );
    expect(await screen.findByText("Account review")).toBeInTheDocument();
    expect(screen.getByText("Payment question")).toBeInTheDocument();
    expect(
      screen.getByText("Select a message from the list to view details"),
    ).toBeInTheDocument();
  });

  it("shows the selected message and its recipient details", async () => {
    const user = userEvent.setup();
    await renderPage();

    await user.click(await screen.findByText("Account review"));

    expect(
      screen.getByText("Your account review is complete."),
    ).toBeInTheDocument();
    expect(screen.getByText(/Sent to: Ava Stone/)).toBeInTheDocument();
  });

  it("opens the new-message module with the fetched user list", async () => {
    const user = userEvent.setup();
    await renderPage();

    await user.click(screen.getByRole("button", { name: "📨" }));

    expect(jest.mocked(AdminMessageModule).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        userId: null,
        allUsersData: users,
      }),
    );
  });
});
