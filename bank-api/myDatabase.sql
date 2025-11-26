-- DROP DATABASE IF EXISTS bank;

-- CREATE DATABASE bank;

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
    phone VARCHAR(15),
    customer_address VARCHAR(255),
    dob DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    account_type VARCHAR(20) NOT NULL,
    account_nr VARCHAR(30) UNIQUE NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts(account_id),
    customer_id INT REFERENCES customers(customer_id),
    money_amount DECIMAL(10, 2) DEFAULT 1000.00,
    balance DECIMAL(10, 2) NOT NULL,
    -- balance DECIMAL(15, 2) DEFAULT 0.00,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

--If each customer can have multiple accounts, and each account can have multiple transactions,

INSERT INTO customers
(customer_id, first_name, last_name, email, password, phone, customer_address, dob) 
VALUES (1, 'Julian', 'Golovens', 'julian@test.com', '123', '123-456-7890', '123 Main St, Springfield, IL', '1995-06-15'),
(2, 'Tom', 'Simpsons', 'tomSimpson@gmail.com', '01234', '123-456-7890', '123 Main St, Springfield, IL', '1985-06-15'),
(3, 'Den', 'Jason', 'superben@gmail.com', '56789', '123-999-7890', '456 Market St, Salford, IL', '1982-08-15');

INSERT INTO accounts (customer_id, account_type, account_nr, balance)
VALUES (1, 'normal', '12-34-56 / 98765432', 2253.93),
(1, 'savings', '98-76-54 / 12345678', 1500.00),
(2, 'normal', '11-22-33 / 11223344', 1400.00);

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
(2, 2, +500.00, 1500.00, 'Initial deposit'),
(3, 2, -100.00, 1400.00, 'Initial deposit');


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
