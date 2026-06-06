# Week 6 Summary — May 5–7, 2026
**AWS re/Start Cohort 3: Project CloudIgnite**

---

## What We Learned

### PKI, SSL/TLS & AWS KMS (Mon May 5)
- **Public Key Infrastructure (PKI):** Asymmetric encryption — public key encrypts, private key decrypts
- **SSL/TLS key exchange:** Server sends public key → client encrypts symmetric key → both share symmetric key
- **Digital certificates:** CA-signed vs self-signed; expiry and revocation (CRL)
- **AWS Certificate Manager (ACM):** Manages SSL/TLS certificates; automates renewal
- **AWS KMS Lab (Lab 278):** Create symmetric KMS key → encrypt/decrypt files using AWS Encryption SDK CLI on EC2 via SSM

### Identity Management & IAM (Tue May 6)
- **SSO (Single Sign-On):** One login, multiple services; central server issues tokens
- **Federated users:** External identity grants temporary access; no permanent AWS account
- **JWT tokens:** JSON Web Token format with expiry; refresh tokens extend sessions
- **Amazon Cognito:** Managed user auth for web/mobile apps
- **AWS IAM:** Free, global service; Users, Groups, Roles, Policies
- **Root account:** Full access; use only for initial setup; enable MFA
- **IAM Roles:** Temporary delegated access (e.g., EC2 → S3 without stored credentials)
- **Explicit Deny > Explicit Allow > Implicit Deny** — policy evaluation logic
- **Lab 279:** IAM users, groups, permissions — granular access control

### CloudTrail, AWS Config & Incident Response (Wed May 7)
- **AWS CloudTrail:** Records who, when, what, where, how for every API call
- **AWS Config:** Compliance monitoring — checks resources against rules; alerts via SNS
- **Incident Response:** Stop → Inspect → Notify → Remediate → Prevent
- **BCP/DRP:** Business Continuity Plan; Disaster Recovery Plan
- **Recovery metrics:** RTO (max downtime), RPO (max data loss), WRT (time to restore)
- **DR strategies:** Backup & Restore → Pilot Light → Active-Passive → Active-Active
- **AWS Network Firewall (Lab 280):** Block malicious URLs with Suricata-compatible rules

### Key CLF-C02 Connections
- AWS KMS, ACM, IAM (Users/Groups/Roles/Policies), SSO, Cognito, GuardDuty, CloudTrail, AWS Config, DR (RTO/RPO), AWS Network Firewall

---

## Daily Notes
- [May 5](./2026-05-05.md) — PKI, SSL/TLS, Digital Certificates, AWS KMS Lab, IAM Intro
- [May 6](./2026-05-06.md) — SSO, Federated Users, JWT, Cognito, IAM Deep Dive, Malware, IDS, GuardDuty
- [May 7](./2026-05-07.md) — CloudTrail, AWS Config, Incident Response, DR Strategies, AWS Network Firewall Lab