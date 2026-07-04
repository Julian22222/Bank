export const mockAuthService = {
  login: jest.fn().mockResolvedValue({
    customer_id: 1,
    first_name: 'Julian',
    last_name: 'Golovens',
    email: 'julian@test.com',
    phone: '123-456-7890',
    customer_address: '123 Main St, Springfield, IL',
    dob: '1995-06-15',
    created_at: '2026-04-20 20:53:22',
  }),

  logout: jest.fn().mockResolvedValue({
    message: 'Logged out',
  }),

  refreshToken: jest.fn().mockResolvedValue({
    admin_id: 1,
    role: 'Admin',
    admin_name: 'Sam',
    email: 'sam@admin.com',
    phone: '+447835473879',
    customer_address: 'Manchester, UK',
    dob: '1995-06-15',
    created_at: '2026-04-20 20:53:22',
  }),
};
