# Week 5 Summary — April 27–30, 2026
**AWS re/Start Cohort 3: Project CloudIgnite**

---

## What We Learned

### Networking Deep Dive (Mon Apr 27)
- **Subnet masks:** Bitwise AND operation to determine network membership
- **CIDR blocks:** `/16` = 65,536 addresses; larger prefix = smaller network
- **Application protocols:** HTTP (80), HTTPS (443), SSL/TLS, SMTP (send), POP/IMAP (receive), RDP (3389), SSH (22)
- **DNS:** Translates domain names to IP addresses
- **Troubleshooting tools:** `ping` (Layer 3), `traceroute` (Layer 3), `nslookup` (DNS), `netstat` (Layer 4), `telnet` (Layer 4), `curl`/`wget` (Layer 7)
- **Labs 265–266:** Network commands, connectivity troubleshooting

### IoT & Enterprise Mobility (Tue Apr 28)
- **Wireless technologies:** Wi-Fi (WPA2), Bluetooth/BLE, 5G, Satellite
- **IoT:** Connected devices; AWS IoT Core supports HTTPS, MQTT, WSS, LoRaWAN
- **Amazon WorkSpaces:** Virtual desktop accessible from any device
- **Lab 267:** Build VPC from scratch — 2 public + 2 private subnets, route tables, EC2 with Apache

### Security Fundamentals (Tue Apr 29)
- **CIA Triad:** Confidentiality, Integrity, Availability
- **Threats:** Malware, DDoS, Man-in-the-Middle, Phishing, Social Engineering
- **AWS Shared Responsibility Model:** AWS = Security OF the Cloud; Customer = Security IN the Cloud
- **Security controls:** Preventive, Detective, Corrective
- **Network hardening:** Default-deny firewalls, close unused ports
- **System hardening:** Patch OS, remove unused apps
- **IAM:** Principle of least privilege, MFA, strong password policies

### AWS Security Services (Wed Apr 30)
- **Amazon Inspector:** Scans EC2 and Lambda for vulnerabilities
- **AWS Trusted Advisor:** Best practice recommendations
- **Amazon GuardDuty:** Continuous AI-powered threat detection
- **AWS Shield:** DDoS protection (Standard = free, Advanced = paid)
- **AWS CloudTrail:** Audit logging of all API activity
- **AWS Security Hub:** Centralized security findings dashboard
- **Lab 276:** Amazon Inspector — found and fixed outdated Python library in Lambda

### Key CLF-C02 Connections
- CIA Triad, Shared Responsibility Model, Security Groups, NACLs, Inspector, Trusted Advisor, GuardDuty, Shield, CloudTrail, Security Hub, IAM

---

## Daily Notes
- [April 27](./2026-04-27.md) — Subnet Masks, CIDR, OSI Recap, TCP/UDP, Application Protocols, DNS, Troubleshooting Tools
- [April 28](./2026-04-28.md) — Wireless, IoT, Amazon WorkSpaces, VPC Lab 267, CIA Triad, Security Intro
- [April 29](./2026-04-29.md) — Security Threats, Shared Responsibility Model, Security Lifecycle, Network/System Hardening, IAM
- [April 30](./2026-04-30.md) — Wireshark, VPN vs Firewall, AWS Security Services, Amazon Inspector Lab, Cryptography Intro