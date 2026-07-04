-- DROP DATABASE IF EXISTS bank;

-- CREATE DATABASE bank;

DROP TABLE IF EXISTS registration;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS customers;

-- \c bank;

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    customer_address VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    admin_id SERIAL PRIMARY KEY,
    role VARCHAR(30) DEFAULT 'admin',
    admin_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    customer_address VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    account_type VARCHAR(20) NOT NULL,
    account_nr VARCHAR(30) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    overdraft_limit DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts(account_id),
    customer_id INT REFERENCES customers(customer_id),
    money_amount DECIMAL(10, 2) DEFAULT 200.00,
    balance DECIMAL(10, 2) DEFAULT 200.00,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    msg_subject VARCHAR(255) NOT NULL,
    msg_status VARCHAR(50) NOT NULL,
    msg_body TEXT NOT NULL,
    msg_created_by VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registration (
    registration_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    customer_address VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE login_attempts (
--     attempt_id SERIAL PRIMARY KEY,
--     customer_id INT REFERENCES customers(customer_id),
--     attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     success BOOLEAN NOT NULL,
--     ip_address VARCHAR(45)
-- );

--If each customer can have multiple accounts, and each account can have multiple transactions,

INSERT INTO customers
(customer_id, first_name, last_name, email, password, phone, customer_address, dob) 
VALUES (1, 'Julian', 'Golovens', 'julik.golovenj@gmail.com', '$2b$10$4qZWJviWncUfQN8yG0iOTuFRJxEmSrbNtwkp6nAIM7dPA4DBzvTUC', '+447892828653', '123 Main Road, Manchester', '1995-06-15'),
(2, 'Tom', 'Simpsons', 'tomsimpson@test.com', '$2b$10$yI33zf9VaPsT3ydsJUznFu9VIuDe.4M9xEg7F/Juy9yFxNeSoLeDq', '+447892828655', '456 Main St, Springfield, IL', '1985-06-15');


INSERT INTO accounts (customer_id, account_type, account_nr)
VALUES (1, 'Main', '12-34-56 / 98765432'),
(1, 'Saver', '98-76-54 / 12345678'),
(2, 'Main', '11-22-33 / 11223344');

INSERT INTO transactions (account_id, customer_id, money_amount, balance, details) 
VALUES
(1, 1, +2000.00, 3000.00, 'Initial deposit'),
(1, 1, -500.00, 2500.00, 'ATM Withdrawal'),
(1, 1, -4.50, 2495.50, 'Starbucks Coffee'),
(1, 1, -52.30, 2443.20, 'Tesco Superstore'),
(1, 1, +2400.00, 4843.20, 'Salary - GOOGLE Ltd'),
(1, 1, -10.99, 4832.21, 'Netflix Subscription'),
(1, 1, -49.20, 4783.01, 'ASDA Groceries'),
(1, 1, -340.45, 4442.56, 'WaterUtilities Bill Payment'),
(1, 1, -750.00, 3692.56, 'Rental Payment'),
(1, 1, -250.00, 3442.56, 'Ryanair tickets'),
(1, 1, -78.30, 3364.26, 'Travel insurance'),
(1, 1, -315.34, 3048.92, 'British Gas payment'),
(1, 1, -65.00, 2983.92, 'Car Repair Service'),
(1, 1, -120.00, 2863.92, 'Grocery Shopping at Sainsburys'),
(1, 1, -45.00, 2818.92, 'Dining at Pizza Hut'),
(1, 1, -30.00, 2788.92, 'Uber Ride'),
(1, 1, -15.00, 2773.92, 'Book Purchase from Waterstones'),
(1, 1, -209.75, 2564.17, 'Dining at Olive Garden'),
(1, 1, -150.00, 2414.17, 'Amazon Purchase'),
(1, 1, -40.00, 2374.17, 'Gym Membership Fee'),
(1, 1, -35.00, 2339.17, 'Movie Tickets'),
(1, 1, -78.24, 2260.93, 'Gas Station Fuel'),
(1, 1, -7.00, 2253.93, 'Coffee Shop Visit'),
(2, 1, +1500.00, 1500.00, 'Initial deposit'),
(3, 2, 1400.00, 1400.00, 'Initial deposit');

INSERT INTO admins
(admin_name, email, password, phone, customer_address, dob) 
VALUES ('Sam', 'sam@admin.com', '$2b$10$CBMBY/pEjOv4Uq.KK1zGX..Aeceq1v0PGu92qXw72xogjG.1qUNe2', '+447835473879', 'Manchester, 156 Manchester Road', '1995-06-15');

INSERT INTO messages
(customer_id, msg_subject, msg_status, msg_body, msg_created_by) VALUES
(1, 'Welcome to BIG Bank', 'Open', 'Dear Julian Golovens,\n\n
        Welcome to BIG bank, and thank you for opening a new account with us.\n\n
        We’re delighted to have you join us, and as a small token of our appreciation, we have credited £200 to your account.\n\n
        If you have any questions or need assistance, our team is always here to help.\n\n
        Thank you for choosing us.\n\n
        Kind regards,\n
        Your Bank Team.', 'autogenerated'),
(1, 'Loan Application', 'Open', 'If you are considering applying for a personal loan, our team is here to help guide you through the process. We understand that financial decisions are important, and we aim to provide clear, supportive information tailored to your needs.\n\n
Our loan department can offer detailed advice on available options, eligibility requirements, and repayment plans. Whether you’re planning a major purchase, consolidating debt, or covering unexpected expenses, we’re ready to assist you in finding the most suitable solution.\n\n
Please don’t hesitate to contact our loan department for more information. Our representatives will be happy to answer your questions and help you take the next step with confidence.', 'Sam'),
(1, 'Card Replacement', 'Open', 'We have received your request to replace your debit card. \n\nPlease allow 5-7 business days for processing.', 'Sam'),
(2, 'Welcome to BIG Bank', 'Open', 'Dear Tom Simpsons,\n\n
        Welcome to BIG bank, and thank you for opening a new account with us.\n\n
        We’re delighted to have you join us, and as a small token of our appreciation, we have credited £200 to your account.\n\n
        If you have any questions or need assistance, our team is always here to help.\n\n
        Thank you for choosing us.\n\n
        Kind regards,\n
        Your Bank Team.', 'autogenerated');


INSERT INTO registration (registration_id, first_name, last_name, email, phone, customer_address, dob) VALUES (
1, 'Max', 'Goloven', 'max@test.com', '+447892828652', '23 Bolton Avenue, Spiningfield', '2001-06-15',
2, 'Michael', 'Goloven', 'mike@test.com', '+447892828657', '34 London Road, Spiningfield', '1998-11-15'
);


SELECT * FROM customers;
SELECT * FROM accounts;
SELECT * FROM transactions;


-- Comprehensive query to join all 3 tables and display relevant information
-- SELECT customers.*, accounts.account_type, transactions.* 
-- FROM customers 
-- JOIN accounts ON customers.customer_id = accounts.customer_id
-- JOIN transactions ON accounts.customer_id = transactions.customer_id
-- ORDER BY customers.customer_id, accounts.account_id, transactions.transaction_id;



--EXPLANATION:
-- JOIN accounts a ON c.customer_id = a.customer_id → links each customer to their accounts
--JOIN transactions t ON a.account_id = t.account_id → links each account to its transactions
--ORDER BY helps sort results by customer → account → transaction



--If you want only the latest transaction per account, you can use:
--    SELECT DISTINCT ON (a.account_id)
--     c.first_name,
--     c.last_name,
--     a.account_id,
--     a.account_type,
--     t.transaction_date,
--     t.balance
-- FROM customers c
-- JOIN accounts a ON c.customer_id = a.customer_id
-- JOIN transactions t ON a.account_id = t.account_id
-- ORDER BY a.account_id, t.transaction_date DESC;
