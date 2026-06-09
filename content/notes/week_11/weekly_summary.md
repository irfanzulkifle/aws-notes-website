# Week 11 Summary — June 8, 2026
**AWS re/Start Cohort 3: Project CloudIgnite**

---

## What We Learned

### System Operations (SysOps) & Automation (Mon Jun 8)

#### System Operations Overview
- **SysOps** = deployment, administration, monitoring, maintenance, security of cloud infrastructure
- Core responsibilities: Build, Test, Deploy, Monitor, Maintain, Safeguard
- **Automation tools:** Bash/Shell, Python (recommended), C#/Ruby, CloudFormation, Terraform
- Key distinction: **CloudFormation** creates reusable infrastructure templates; **IAM** manages permissions only

#### Troubleshooting Knowledge Base
- Structured document (Excel/CSV) recording known issues, symptoms, root causes, resolution steps
- Fields: Issue Number, Category, Description, Symptoms, Root Cause Analysis, Resolution, Helpful Tools
- Categories: Storage & Data Management, Networking, Security & Compliance, Compute
- Enables consistent response and institutional memory

#### AWS Identity and Access Management (IAM) — Recap
- **Three access methods:** Management Console (GUI), AWS CLI, AWS SDK
- **Identity types:** User, Group, Role
- **Policy types:** Identity-based, Resource-based, SCP (org-level), ACL (legacy)
- **IAM policy JSON:** Effect (Allow/Deny), Action, Resource, Condition (optional)
- **Best practices:** Least privilege, use IAM Roles, enable MFA, never use root
- **SSO/Federated access:** single credentials for multiple services; cross-account access via roles

#### AWS Command Line Interface (CLI)
- Terminal-based AWS management
- Installation: download zip → unzip → `sudo ./aws/install`
- Configuration: `aws configure` (stores keys in `~/.aws/credentials` and `~/.aws/config`)
- Output formats: `json`, `table`, `text`
- Common commands: `aws ec2 describe-instances`, `aws s3 ls`, `aws iam list-users`
- **Dry run:** `--dry-run` simulates command to check permissions without execution
- CLI is **instance-specific** — configure on each EC2 separately

#### AWS Systems Manager (SSM)
- Centralized management of many EC2/on-prem servers without SSH
- **Capabilities:**
  - Fleet Manager — inventory of managed instances
  - Run Command — execute scripts across instances simultaneously
  - Session Manager — browser-based terminal, no port 22 needed
  - Patch Manager — centralized OS patching
  - Maintenance Window — schedule tasks
  - State Manager — enforce desired state
  - Parameter Store — store secrets/config values securely
- **SSM Documents:** instruction files (Bash-like) used by Run Command, State Manager
- **Parameter Store:** EC2 reads parameters at runtime; enables dynamic configuration

#### Labs: AWS CLI & Systems Manager
- **Lab 168:** Installed AWS CLI on EC2, configured with IAM credentials, retrieved IAM policy using CLI
- **SSM Lab:** Used Fleet Manager for inventory, Run Command to install dashboard app, Parameter Store to toggle beta feature, Session Manager for browser-based SSH-less access

### Key CLF-C02 Connections
- **IAM:** Users/Groups/Roles; identity-based vs resource-based policies; SCPs; MFA; Least Privilege
- **AWS CLI & SDK:** three access methods for AWS (Console, CLI, SDK)
- **AWS Systems Manager:** central management; Run Command, Session Manager, Parameter Store, Fleet Manager
- **CloudFormation:** Infrastructure-as-Code for reusable templates (contrast with IAM)
- **Automation philosophy:** automate repetitive tasks; use Python/CloudFormation/Terraform
- **Shared Responsibility:** You manage IAM users and policies; AWS manages the underlying service infrastructure

---

## Daily Notes
- [June 8](./2026-06-08.md) — System Operations, AWS CLI, AWS Systems Manager, IAM Recap, Troubleshooting Knowledge Base
