# Week 10 Summary — June 3–6, 2026
**AWS re/Start Cohort 3: Project CloudIgnite**

---

## What We Learned

### SQL Advanced & Amazon RDS (Tue Jun 3)
- **SQL advanced:** ORDER BY, GROUP BY, HAVING, UNION, INTERSECT, MINUS, JOINs (INNER, LEFT, RIGHT, FULL), Window functions (OVER, RANK)
- **Amazon RDS Lab 160:** Security Group for DB (source = Web Security Group), DB Subnet Group (private subnets), Multi-AZ for high availability
- **3-tier architecture:** Internet → EC2 (Public Subnet) → RDS (Private Subnet)

### RDS Deep Dive, Aurora & DynamoDB (Wed Jun 4)
- **RDS:** Fully managed relational DB; AWS handles OS, patching, backups, hardware; supports MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora
- **Multi-AZ vs Read Replicas (Highly Tested):** Multi-AZ = availability/failover (sync replication, standby is idle); Read Replica = scalability/performance (async replication, can serve reads)
- **Amazon Aurora:** AWS-native, MySQL/PostgreSQL-compatible, faster, slightly more expensive; uses read/writer endpoints
- **Amazon DynamoDB:** Fully managed NoSQL; key-value store; flexible schema (no ALTER TABLE); Partition Key + optional Sort Key
- **DynamoDB Global Tables:** Multi-region replication for low latency and disaster recovery
- **DAX:** In-memory cache for DynamoDB (like Redis, DynamoDB-specific)
- **Labs 274–275:** Aurora MySQL-compatible cluster; DynamoDB table creation and querying

### AWS CAF & Well-Architected Framework (Thu Jun 5)
- **CAF (planning tool):** 6 perspectives — 3 Business (Business, People, Governance) + 3 Technical (Platform, Security, Operations)
- **WAF (design/operational tool):** 6 pillars — Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability
- **Reliability vs Availability:** Reliability = system works as expected (MTBF); Availability = system is up (% uptime, "nines")
- **High Availability factors:** Fault tolerance, Scalability, Recoverability
- **The "nines":** 99.999% = ~5 minutes max downtime/year; Amazon S3 = 11 nines durability
- **Traditional → AWS mapping:** Physical server → EC2, SAN → EBS, NAS → EFS, tape backup → S3, AD → AWS Directory Service

### RDS/Aurora/DynamoDB Labs & Database Normalization (Fri Jun 6)
- **Aurora:** Automatic Multi-AZ replication; Writer endpoint (read/write) vs Reader endpoint (read-only)
- **DynamoDB:** Schema-flexible; Query (fast, uses key) vs Scan (reads all items, slow)
- **SQL JOINs:** INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF JOIN
- **Database Normalization:** Separate tables eliminate redundancy; store country_id not full country data; prevents anomalies
- **AWS DMS:** Migrate on-prem databases to AWS; continuous replication while old DB stays live
- **Manual migration:** `mysqldump` → S3 → RDS for small databases

### Key CLF-C02 Connections
- **Amazon RDS:** Core managed database service; multiple engines; automatic patching/backups
- **Amazon Aurora:** AWS-native high-performance relational DB; MySQL/PostgreSQL compatible
- **Multi-AZ vs Read Replicas:** Availability vs scalability — heavily tested distinction
- **Amazon DynamoDB:** NoSQL; key-value; flexible schema; Global Tables for multi-region
- **DAX:** In-memory cache for DynamoDB read performance
- **AWS CAF:** 6 perspectives for planning migration
- **AWS WAF:** 6 pillars for designing cloud systems
- **Reliability vs Availability:** MTBF, "nines"
- **High Availability:** Fault tolerance, scalability, recoverability — exam vocabulary
- **Traditional → AWS mapping:** EC2, EBS, EFS, S3, AWS Directory Service
- **AWS DMS:** Database Migration Service for moving existing DBs to AWS

---

## Daily Notes
- [June 3](./2026-06-03.md) — SQL Advanced (ORDER BY, GROUP BY, HAVING, UNION, JOIN, Window Functions), Amazon RDS Lab 160
- [June 4](./2026-06-04.md) — Amazon RDS Deep Dive, Aurora, DynamoDB, Labs 274–275
- [June 5](./2026-06-05.md) — AWS Cloud Adoption Framework (CAF), Well-Architected Framework, Reliability & HA, Lab 16
- [June 6](./2026-06-06.md) — RDS/Aurora/DynamoDB Labs, SQL JOINs, Database Normalization, AWS DMS