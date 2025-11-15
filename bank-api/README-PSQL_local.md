# how to use local PSQL

- First create your Database

1. Open PSQL console

```JS
//to open local psql console use this command
sudo -u postgres psql
```

```JS
//in psql console put
DROP DATABASE IF EXISTS my_database;

CREATE DATABASE my_database;

\c my_database   //to connect to the database in the psql CLI.
//if we have "bank" <-- name of our Database, in psql console, we connect to your database
\c bank
```

```JS
//after successful connection to correct databse, this command will show -> You are now connected to database "bank" as user "postgres".
//Now you now your username - "postgres". IF you forgot your username
```

```JS
//in psql console put this command to change the passwqord if you don't remember -->
password postgres
```

# psql -f <example.sql> <-- example.sql content

- If you already created Database in psql console then you put -->

```JS
//❌ DROP DATABASE IF EXISTS bank;   <-- DON'T NEED

//❌ CREATE DATABASE bank;        <-- DON'T NEED

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS customers;

//❌  \c bank;           <-- DON'T NEED

CREATE TABLE tableName1 (.....);
CREATE TABLE tableName2 (.....);

INSERT INTO tableName1 (...) VALUES (...);
INSERT INTO tableName2 (...) VALUES (...);
```

- If don't have Database name and you want to create the database from scratch

If you want myDatabase.sql to create the database automatically, then you should connect to postgres instead (the default admin DB), not to bank (Database name).

```JS
//Run this command
psql -h localhost -p 5432 -U postgres -d postgres -f myDatabase.sql
```

```JS
//then in example.sql file put -->

DROP DATABASE IF EXISTS bank;
CREATE DATABASE bank;
\c bank;  -- connect to the new database

-- Now create tables inside it
CREATE TABLE customers (...);
CREATE TABLE accounts (...);
CREATE TABLE transactions (...);

```

# Running a file with PSQL

- SQL commands can also be written in a file and then run with psql to make the code reusable with the following commands:

```JS
//to print output to the terminal
psql -f example.sql

//to print output to an example.txt file
psql -f example.sql > example.txt
```

/////////////////////////////////////////

# PSQL localhost (local DB)

1. The command:

```JS
psql -f <filename.sql>
```

will execute all the SQL commands from <filename.sql>, but only if you’re already connected (via environment variables or defaults) to the right PostgreSQL database.

- environment variables --> .env

```JS
PGDATABASE=bank
PGPORT=5432
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=yyyyy
```

- psql use defaults variables, If you don’t specify connection details, psql assumes:

```JS
//psql default variables

Database name = your OS username
User = your OS username
Host = localhost
Port = 5432
```

#### If you have different psql values, you can use:

Instead of relying on .env file, you can pass your connection details directly in the command:

```JS
psql -h localhost -p 5432 -U your_username -d your_database -f filename.sql
```

From example above, each letter flags different variables:

- psql <-- The PostgreSQL interactive terminal program — used to connect to a PostgreSQL server and execute SQL commands.
- -f flag tells psql to execute, read the commands from the specific file. The file that contains SQL commands to execute.
- -d flag <-- you specifies the database name to connect to
- -U <--username, The PostgreSQL username to connect with.
- -p <-- connection Port to DB, The port on which the PostgreSQL server is listening. The default is 5432, so you usually don’t need to change it unless your server runs on a different port.
- -h <-- host, The host — tells PostgreSQL which server to connect to.
  localhost means the database is running on your own computer.

```JS
//If you want to see each SQL command as it runs (for debugging), add -a:
psql -h localhost -U your_username -d your_database -a -f filename.sql


//If you want it to stop on the first error, add --set ON_ERROR_STOP=on:
psql -h localhost -U your_username -d your_database --set ON_ERROR_STOP=on -f filename.sql
```

# You can now directly run commands in terminal like:

```JS
psql -h localhost -U postgres -d mydb

//or

psql -h localhost -U postgres -d mydb -f setup.sql

//or

psql -h localhost -p 5432 -h localhost -U postgres -d bank -f myDatabase.sql

```

this command will have all details to connect tou your DB

# Load your .env automatically when you use psql -f <filename.sql> command

if you want to use psql -f <filename.sql> command in terminal

- Set up a .env file, add all Environment Variables there to connect to DB

```JS
//.env file
// ✅ use -> no extra spaces around the equals signs
// ❌ PGDATABASE = bank (Error example)

PGHOST=localhost
PGUSER=postgres
PGDATABASE=mydb
PGPORT=5432
PGPASSWORD=yourpassword
```

- sometymes PostgreSQL is trying to connect to a database named "codenitro"/ or other database — not the one you specified in your .env
- It uses default connection settings (from your current user, system environment, or a default database name that matches your Linux/macOS username). It’s not automatically reading your .env file unless you explicitly tell it to.

- If you want to use your .env file values automatically, you can load them into your shell before running psql:

```JS
export $(grep -v '^#' .env | xargs)
psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -f myDatabase.sql

// $PGHOST, $PGPORT, $PGUSER, $PGDATABASE <-- these names from .env file
```

- If it is not working you can reload environment variables, to avaoid cashed environment variables

Reload environment variables safely

```JS
//in terminal

set -a
source .env
set +a
```

- then --> psql -f <filename.sql>

# Other option run your local PostgreSQL (psql) commands or SQL scripts right from inside VS Code

Use an SQL extension

If you want to run SQL directly from VS Code, install an extension such as:

🐘 PostgreSQL (official by Microsoft)
SQLTools + PostgreSQL driver
These let you:

Connect to your local DB
Run queries inline
View results in an output panel
