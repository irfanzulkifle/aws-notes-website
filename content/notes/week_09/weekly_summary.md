# Week 9 Summary — May 25–30, 2026
**AWS re/Start Cohort 3: Project CloudIgnite**

---

## What We Learned

### Database Fundamentals (Mon May 25)
- **Data models:** Relational (SQL), Semi-structured (CSV/XML), Entity-Relationship, Object-Based (JSON)
- **Relational database:** Tables with rows/columns; fixed schema; primary keys and foreign keys
- **Relationships:** One-to-One, One-to-Many, Many-to-Many
- **SQL categories:** DDL (CREATE, ALTER, DROP), DML (INSERT, UPDATE, DELETE), DQL (SELECT), DCL (GRANT, REVOKE), TCL (COMMIT, ROLLBACK)
- **Data types:** CHAR(n) vs VARCHAR(n), SMALLINT/INT/BIGINT, DECIMAL vs FLOAT/REAL, DATE/TIME/TIMESTAMP
- **Constraints:** NOT NULL, UNIQUE, DEFAULT, PRIMARY KEY, FOREIGN KEY
- **Transactions:** ACID properties (Atomicity, Consistency, Isolation, Durability)
- **AWS database services:** RDS, Aurora (SQL), DynamoDB, DocumentDB (NoSQL)

### SQL DDL & DML (Tue May 26)
- **DDL commands:** `CREATE DATABASE/TABLE`, `ALTER TABLE`, `DROP TABLE`, `SHOW`, `DESCRIBE`
- **DML commands:** `INSERT INTO`, `SELECT`, `UPDATE SET`, `DELETE FROM`
- **CSV import/export:** `LOAD DATA INFILE`, `SELECT INTO OUTFILE`
- **Data cleaning:** Common errors, SQL string functions (TRIM, CONCAT, UPPER, LOWER, LEFT, RIGHT)
- **Labs 268–269:** Creating databases/tables, inserting/updating/deleting data, loading from SQL files

### SQL Queries & Filtering (Thu May 28)
- **NULL values:** Absence of value; `NULL = NULL` is FALSE; use `IS NULL` / `IS NOT NULL`
- **WHERE filtering:** `=`, `<>`, `>`, `<`, `AND`, `OR`, `IN`, `BETWEEN`, `LIKE`
- **LIKE wildcards:** `%` = zero or more chars; `_` = exactly one char
- **GROUP BY:** Groups rows for aggregate calculations; **HAVING:** Filters groups after GROUP BY
- **ORDER BY:** ASC (default) / DESC; **LIMIT:** Cap returned rows
- **Lab 270:** WHERE, LIKE, IN, BETWEEN, aggregate queries on world database

### SQL Advanced Queries (Fri May 29)
- **Operator precedence:** Parentheses > Arithmetic > Comparison > NOT > AND > OR
- **Aggregate functions:** `SUM()`, `AVG()`, `COUNT()`, `MAX()`, `MIN()`
- **DISTINCT:** Removes duplicate values; `COUNT(DISTINCT col)`
- **String/Date functions:** `LOWER`, `UPPER`, `TRIM`, `CHAR_LENGTH`, `CURRENT_DATE`, `DATE_ADD`
- **Labs 271–272:** Conditional queries, aggregate functions, string functions, customer table filtering

### MySQL Labs (Sat May 30)
- **Labs 268–271:** Full hands-on MySQL practice
- **Common mistakes:** Using `==` instead of `=`, forgetting WHERE on UPDATE/DELETE, parent-child delete order

### Key CLF-C02 Connections
- Amazon RDS (managed relational DB), Aurora (AWS-native, high performance), DynamoDB (NoSQL), DocumentDB, Redshift
- EC2 for lab environments, SSM Session Manager (secure keyless access), Security Groups
- Shared Responsibility Model (self-managed DB on EC2 vs managed RDS)

---

## Daily Notes
- [May 25](./2026-05-25.md) — Database Fundamentals, Data Models, SQL Overview, Constraints, ACID, DBaaS
- [May 26](./2026-05-26.md) — SQL Data Types, DDL & DML, CSV Import/Export, Data Cleaning
- [May 28](./2026-05-28.md) — NULL Values, SELECT Statement, WHERE/LIKE/IN/BETWEEN, GROUP BY/HAVING
- [May 29](./2026-05-29.md) — Operator Precedence, NULL Behavior, Aggregate Functions, String Functions
- [May 30](./2026-05-30.md) — MySQL Labs 268–271, Full Hands-on Practice