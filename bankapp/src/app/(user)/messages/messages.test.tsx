import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { apiServerFetch } from "@/src/lib/api-server";
import { handleReadMessage } from "../../actions/handleReadMessageActions";
import { UserProvider } from "../UserContext";
import Messages from "./page";

jest.mock("@/src/lib/api-server", () => ({
  apiServerFetch: jest.fn(),
}));

jest.mock("../user-page/UserPageHeader", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("../../actions/handleReadMessageActions", () => ({
  handleReadMessage: jest.fn(),
}));

jest.mock("../../actions/editFlaggedMessageStatus", () => ({
  editFlaggedMessageStatus: jest.fn(),
}));

jest.mock("../../actions/adminMessageDeleteAction", () => ({
  handleAdminMessageDeletion: jest.fn(),
}));

describe("Messages page", () => {
  const messages = [
    {
      message_id: 1,
      customer_id: 7,
      msg_subject: "Account update",
      msg_status: "normal",
      msg_body: "Your account details have been updated.",
      msg_created_by: "Support",
      is_read: false,
      sent_at: "2026-01-15T10:00:00.000Z",
    },
    {
      message_id: 2,
      customer_id: 7,
      msg_subject: "Payment delay",
      msg_status: "urgent",
      msg_body: "A payment is taking longer than expected.",
      msg_created_by: "Support",
      is_read: true,
      sent_at: "2026-01-16T10:00:00.000Z",
    },
  ];

  const activeUser = {
    customer_id: 7,
    first_name: "Taylor",
    last_name: "Doe",
    email: "taylor@example.com",
    phone: "+447700900000",
    customer_address: "1 High Street",
    dob: "1990-01-01",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(apiServerFetch).mockResolvedValue(messages);
    jest
      .mocked(handleReadMessage)
      .mockResolvedValue({ success: true, data: {} });
  });

  const renderMessagesPage = async () => {
    const page = await Messages();

    return render(
      <UserProvider
        initialUser={activeUser}
        initialUserAllAccounts={[]}
        initialUserAllTransactions={[]}
      >
        {page}
      </UserProvider>,
    );
  };

  it("fetches and displays the user's messages", async () => {
    await renderMessagesPage();

    expect(apiServerFetch).toHaveBeenCalledWith(
      `${process.env.BACK_END_URL}/messages/my`,
      {
        cache: "no-store",
        next: { tags: ["allUserMessages"] },
      },
    );
    expect(await screen.findByText("Account update")).toBeInTheDocument();
    expect(screen.getByText("Payment delay")).toBeInTheDocument();
    expect(
      screen.getByText("Select a message from the list to view details"),
    ).toBeInTheDocument();
  });

  it("filters the message list by subject", async () => {
    const user = userEvent.setup();
    await renderMessagesPage();

    await user.type(screen.getByPlaceholderText("Search..."), "payment");

    expect(screen.getByText("Payment delay")).toBeInTheDocument();
    expect(screen.queryByText("Account update")).not.toBeInTheDocument();
  });

  it("opens a selected message and marks it as read", async () => {
    const user = userEvent.setup();
    await renderMessagesPage();

    await user.click(await screen.findByText("Account update"));

    expect(
      screen.getByText("Your account details have been updated."),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(handleReadMessage).toHaveBeenCalledWith(1);
    });
  });
});
