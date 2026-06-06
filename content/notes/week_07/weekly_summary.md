# Week 7 Summary — May 11–15, 2026
**AWS re/Start Cohort 3: Project CloudIgnite**

---

## What We Learned

### Security Compliance & AWS Support (Mon May 11)
- **Compliance types:** Regulatory (PCI DSS, HIPAA, GDPR, PIPEDA) vs Contractual (SLA, PLA)
- **AWS Artifact:** Portal for accessing AWS security/compliance documentation
- **AWS Support Plans:** Developer (business hours) → Business (24/7, ≤4hr) → Enterprise (24/7, ≤15min, TAM)
- **AWS resources:** Trusted Advisor, Personal Health Dashboard, Professional Services, Partner Network

### Python Fundamentals (Mon May 11 – Fri May 15)
- **Python basics:** Interpreted, dynamically typed, cross-platform; data types (`int`, `float`, `bool`, `str`)
- **Collections:** List (ordered, mutable), Set (unordered), Queue (FIFO), Dictionary (key-value)
- **Control flow:** `if/elif/else`, `for`/`while` loops, `break`/`continue`
- **Functions:** `def`, return values, four types (with/without args and return)
- **Exception handling:** `try/except`, specific exception types, user-friendly messages
- **Mutable vs Immutable:** `int`, `float`, `str`, `tuple` (immutable); `list`, `dict`, `set` (mutable)
- **Operators:** Arithmetic, comparison, logical, assignment shortcuts
- **String formatting:** f-strings, `.format()`, `.join()`
- **List comprehension:** `[i for i in range(1, 10)]`
- **Version control:** Git (local) vs GitHub (remote); clone, commit, push, pull, branch, merge
- **AWS Cloud9:** Browser-based IDE running on EC2; integrated terminal
- **AWS Lambda:** Serverless compute; pay per execution; event-driven
- **SCP command:** Upload files to EC2: `scp -i key.pem file.py ec2-user@ip:/path/`
- **Labs 1–3 / 110–115:** Hello World, strings, lists, tuples, dictionaries, exceptions, loops, functions, Caesar Cipher

### Key CLF-C02 Connections
- Compliance standards (PCI DSS, HIPAA, GDPR), AWS Artifact, Support Plans, Trusted Advisor
- AWS Lambda (serverless), Cloud9, CodeCommit, EC2

---

## Daily Notes
- [May 11](./2026-05-11.md) — Security Compliance, AWS Support Plans, Python Introduction & Setup
- [May 12](./2026-05-12.md) — Data Types, Functions, Collections, Static/Dynamic Typing, Git & GitHub, Cloud9
- [May 13](./2026-05-13.md) — Python Operators, Lists, Tuples, Dictionaries, For Loops, AWS Lambda
- [May 14](./2026-05-14.md) — Exceptions, if/elif/else, While/For Loops, CSV File Reading
- [May 15](./2026-05-15.md) — Functions, Exception Handling, Caesar Cipher, SCP Upload to EC2