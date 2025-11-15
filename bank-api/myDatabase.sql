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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts(account_id),
    customer_id INT REFERENCES customers(customer_id),
    money_in DECIMAL(15, 2) DEFAULT 0.00,
    money_out DECIMAL(15, 2) DEFAULT 0.00,
    balance DECIMAL(15, 2) NOT NULL,
    -- balance DECIMAL(15, 2) DEFAULT 0.00,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

--If each customer can have multiple accounts, and each account can have multiple transactions,

INSERT INTO customers
(customer_id, first_name, last_name, email, password, phone, customer_address, dob) 
VALUES (1, 'Julian', 'G', 'julian@test.com', '123', '123-456-7890', '123 Main St, Springfield, IL', '1995-06-15'),
(2, 'Tom', 'Simpson', 'tomSimpson@gmail.com', '01234', '123-456-7890', '123 Main St, Springfield, IL', '1985-06-15'),
(3, 'Den', 'Jason', 'superben@gmail.com', '56789', '123-999-7890', '456 Market St, Salford, IL', '1982-08-15');

INSERT INTO accounts (customer_id, account_type)
VALUES (1, 'normal'),
(1, 'savings'),
(2, 'normal');

INSERT INTO transactions (account_id, customer_id, money_in, money_out, balance, details) 
VALUES
(1, 1, 2000.00, 0.00, 2000.00, 'Initial deposit'),
(1, 1, 0.00, 500.00, 1500.00, 'ATM Withdrawal'),
(2, 2, 1500.00, 0.00, 1500.00, 'Initial deposit'),
(3, 2, 1500.00, 0.00, 3000.00, 'Initial deposit');


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
