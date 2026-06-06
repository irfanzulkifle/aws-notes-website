# Week 4 Summary — April 20–24, 2026
**AWS re/Start Cohort 3: Project CloudIgnite**

---

## What We Learned

### Bash Scripting (Mon Apr 20)
- **Script basics:** Shebang (`#!/bin/bash`), `echo`, `read`, variables, `chmod +x`, `./script.sh`
- **Conditionals:** `if/elif/else/fi`, comparison operators (`-eq`, `-gt`, `-lt`), file test operators (`-f`, `-e`, `-d`)
- **Loops:** `for` (range/list), `while`, `until`, `break`, `continue`
- **Exit codes,** command substitution (`$(date)`), `printf`
- **Lab:** Backup script using `tar -czvf` with date-stamped filenames
- **Package management:** `yum` (Amazon Linux), `apt` (Ubuntu/Debian)
- **AWS CLI installation:** Download, unzip, install, configure with `aws configure`

### Networking & VPC (Tue Apr 21 – Fri Apr 24)
- **OSI Model (7 layers):** Application, Presentation, Session, Transport, Network, Data Link, Physical
- **Amazon VPC:** Logically isolated virtual network; public vs private subnets; CIDR blocks; Internet Gateway; VPC Peering
- **Protocols:** TCP (connection-oriented, 3-way handshake) vs UDP (connectionless, fast)
- **IP addressing:** IPv4 (32-bit), IPv6 (128-bit), public vs private IP, DHCP, Elastic IP
- **Subnetting:** CIDR notation, formula for host count
- **Port numbers:** 22 (SSH), 80 (HTTP), 443 (HTTPS), 20/21 (FTP), 53 (DNS), 3389 (RDP)
- **NAT Gateway:** Outbound-only internet for private subnets; requires Elastic IP
- **Security Groups:** Instance-level, stateful, default deny all inbound, allow-only rules
- **NACLs:** Subnet-level, stateless, both allow and deny rules
- **Labs 261–264:** Elastic IP, VPC build, VPC troubleshooting, Security Groups & NACLs

### Key CLF-C02 Connections
- VPC, subnets (public/private), Security Groups, NACLs, Internet Gateway, NAT Gateway, Route Tables, CIDR blocks, Elastic IP, TCP vs UDP, key port numbers

---

## Daily Notes
- [April 20](./2026-04-20.md) — Bash Scripting, Linux Software Management, AWS CLI Installation
- [April 21](./2026-04-21.md) — System Logs, Bash Challenge Lab, Intro to Networking & OSI Model
- [April 22](./2026-04-22.md) — Networking Fundamentals, VPC, TCP/UDP, IP Addressing, Ports
- [April 23](./2026-04-23.md) — IP Addressing, Elastic IP, VPC Fundamentals, CIDR Calculation
- [April 24](./2026-04-24.md) — NAT Gateway, Route Tables, Security Groups, NACLs, VPC Labs