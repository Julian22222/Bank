import { render, screen } from "@testing-library/react";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { RequestCookiesAdapter } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";
import NewUserRegistration from "./NewUserRegistration";
import AdminPage from "./page";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@/src/lib/admin-api-server", () => ({
  adminApiServerFetch: jest.fn(),
}));

jest.mock("../../../components/AdminPageHeader", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("../../../components/AdminFooter", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("./NewUserRegistration", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

jest.mock("./ActiveChats", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("./WelcomeAdmin", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("./ManageAdmins", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("./AccountTypeBtn", () => ({
  __esModule: true,
  default: () => null,
}));

describe("AdminPage", () => {
  const registrations = [
    { registration_id: 1, first_name: "Ava", email: "ava@example.com" },
    { registration_id: 2, first_name: "Noah", email: "noah@example.com" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest
      .mocked(cookies)
      .mockResolvedValue(
        RequestCookiesAdapter.seal(
          new RequestCookies(
            new Headers({ cookie: "admin_access_token=test-admin-token" }),
          ),
        ),
      );
    jest.mocked(adminApiServerFetch).mockResolvedValue(registrations);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("fetches registration requests with the admin cookie and renders the dashboard", async () => {
    render(await AdminPage());

    expect(adminApiServerFetch).toHaveBeenCalledWith(
      `${process.env.BACK_END_URL}/admin/user-registration`,
      {
        headers: { Cookie: "admin_access_token=test-admin-token" },
        cache: "no-store",
      },
    );
    expect(
      screen.getByRole("heading", { name: "2 New requests To Register" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("2", {
        selector: "span",
      }),
    ).toBeInTheDocument();
    expect(jest.mocked(NewUserRegistration).mock.calls[0][0]).toEqual({
      usersToRegister: registrations,
    });
  });

  it("shows six online users", async () => {
    render(await AdminPage());

    expect(
      screen.getByRole("heading", { name: /Online users/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Julian Golovens/)).toBeInTheDocument();
    expect(screen.getByText(/Arthur Cooper/)).toBeInTheDocument();
    expect(screen.queryByText(/Lily Richardson/)).not.toBeInTheDocument();
  });
});
