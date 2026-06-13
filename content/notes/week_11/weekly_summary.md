# Week 11 Summary — June 8–13, 2026
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

### Amazon S3 Static Hosting & EC2 Deep Dive (Tue Jun 9)

#### Amazon S3 Static Website Hosting
- **Static website** = HTML, CSS, client-side JS only (no server-side scripting, no database)
- **Why S3:** No infrastructure to manage, cost-effective (storage + transfer only), automatic scalability, high availability
- **Setup:** Create bucket (globally unique name) → upload files → enable Static Website Hosting → disable Block Public Access → enable ACLs
- **Endpoint format:** `http://<bucket-name>.s3-website-<region>.amazonaws.com`
- **Custom domain:** Use Route 53 to map domain to S3 endpoint
- **Automation:** Use AWS CLI with bash scripts; `aws s3 sync` (only changed files) vs `aws s3 cp --recursive` (re-uploads everything)
- **Bash script pitfall:** `#!/bin/bash` must be on its own line; make executable with `chmod +x`

#### EC2 Deep Dive
- **EC2 architecture:** Virtual machines on hypervisor; CPU, RAM, ephemeral instance store (not persistent — use EBS for persistence)
- **AMI (Amazon Machine Image):** Pre-configured template for launching instances; contains boot volume, block device mapping, launch permissions; sources: AWS-provided, community, custom
- **Instance types:** General Purpose (T), Compute Optimized (C), Memory Optimized (R/X), Storage Optimized (I/D), Accelerated Computing (P/G), HPC (Hpc)
- **Key pairs:** Public key (stored on instance), private key (.pem file, keep safe); used for SSH on port 22
- **IP addressing:**
  - **Private IP:** static within VPC, retained on stop/start
  - **Public IP:** dynamic, changes on every stop/start
  - **Elastic IP:** static public IP, persists across stop/start
- **Security Groups:** Virtual firewall at instance level; control inbound/outbound traffic by port/protocol/source; can reference another SG as source
- **Instance Profile:** Attaches IAM Role to EC2; enables EC2 to access AWS services without storing credentials
- **User Data:** Bash script that runs once at first boot; used for software installation, configuration tasks
- **Instance Metadata Service:** `http://169.254.169.254/latest/meta-data/` — accessible only from within EC2; returns instance info (ID, type, hostname, AMI ID, etc.)
- **Connection methods ranked by security:** SSM Session Manager (no ports, no keys, fully logged) > EC2 Instance Connect (port 22, browser) > SSH (port 22, .pem key)

#### Lab: Static Website on S3 using AWS CLI
- Built static website for Sophia's Café using S3
- Created S3 bucket → created IAM user → attached S3FullAccess policy → enabled public access & ACLs → configured static website hosting
- Uploaded files using `aws s3 cp --recursive --acl public-read`
- Created automation script using `aws s3 sync` (only uploads changed files)

### EC2 Lifecycle, Elastic Beanstalk & Intro to ELB/ASG (Wed Jun 10)

#### EC2 Instance Lifecycle
- **States:** pending → running → stopping → stopped → terminated
- From running: **reboot**, **stop**, or **terminate** (terminate is permanent and unrecoverable)
- **Hibernation:** instance goes to a low-power state but RAM is preserved; resume picks up exactly where it left off

#### Billing by State
| State | Compute Charge | Storage Charge |
|-------|---------------|----------------|
| Running | Yes | Yes (EBS) |
| Stopping | Yes (briefly) | Yes (EBS) |
| Stopped | No | **Yes (EBS)** |
| Terminated | No | No (root EBS deleted by default) |

- Even a stopped instance generates EBS storage cost

#### Data Persistence: Instance Store vs EBS
- **Instance Store:** ephemeral — data lost on stop/restart
- **EBS:** persistent — data preserved across stop/start
- **Delete on Termination** setting controls whether root EBS is removed when instance terminates

#### Public IP vs Elastic IP
- **Public IP** changes on every stop/start (dynamically reassigned)
- **Elastic IP** = static, persistent, reassignable between instances

#### Modifying an Instance
- Must **stop** the instance first to change instance type
- New type's architecture must be compatible (e.g., both 64-bit)
- For hibernation: instance must have an EBS root volume

#### AMI Deprecation
- Custom AMIs deprecated **~2 years** after creation
- Existing instances keep running; new launches are **blocked**
- **Critical for Auto Scaling Groups** — refresh AMI before deprecation

#### AWS Elastic Beanstalk
- **PaaS:** AWS manages OS, runtime, scaling; you upload code
- **No additional charge** — pay only for underlying EC2/EBS/RDS
- Supported platforms: Java, .NET, PHP, Node.js, Python, Ruby, Go, Docker
- IaaS (EC2) vs PaaS (Beanstalk) vs Serverless (Lambda): increasing amount of stack managed by AWS

#### Lab Highlights (Jun 10)
- Launched EC2 via console, then via AWS CLI
- **LAMP troubleshooting:** security group missing port 22; user-data script renamed `.txt` → `.sh` and `chmod +x`'d before running
- Challenge lab: created new VPC via "VPC and more" (auto-creates IGW, route tables, 2 public + 2 private subnets across 2 AZs); CIDR `/16`–`/28`; security group inbound SSH 22 + HTTP 80; outbound = allow all

### Elastic Load Balancing & Auto Scaling Groups (Thu Jun 11)

#### ELB Types
| Type | OSI Layer | Best For |
|------|-----------|----------|
| **ALB** (Application LB) | L7 | Web apps, microservices, path/host-based routing |
| **NLB** (Network LB) | L4 | Extreme performance, gaming, sudden traffic bursts |
| **GWLB** (Gateway LB) | L3/4 | Third-party security/inspection appliances |
| **CLB** (Classic LB) | Legacy | Deprecated — avoid for new designs |

- **ALB features:** path-based routing, host-based routing, TLS termination, target groups, listeners, health checks, native IPv6, deletion protection
- **Rule of thumb:** normal web app → ALB; gaming/high throughput → NLB; security appliance → GWLB; legacy → CLB

#### Auto Scaling Groups (ASG)
- Maintains desired EC2 instance count; scales in/out based on demand
- **Capacity settings:** Minimum (floor), Desired (target), Maximum (ceiling)
- **Scaling policy types:** Target Tracking (e.g., CPU 50%), Step Scaling (reacts to breach size), Simple, Scheduled
- **Shared database (RDS)** is critical — ASG instances are ephemeral; data must live in centralized storage

#### Decoupled / Scalable Architecture
- **ALB in public subnets**, app servers in **private subnets** (not directly reachable)
- **Stateless application design:** no critical data on the instance itself
- Static/media content served from **S3 + CDN**, not app servers
- `Route 53 → ALB → ASG (EC2) → RDS`

#### Lab Highlights (Jun 11)
- **Lab 173:** Fixed hardcoded `--region us-east-1` (replaced with `$region` variable) and wrong port 8080 → 80 in the `create-ec2.txt` automation script; used `nmap -Pn <public-ip>` to confirm open ports
- **Lab 174:** Built ALB + ASG: created AMI from configured instance, created ALB (lab VPC, public subnets, web SG, target group :80), created Launch Template (t3.micro, custom AMI, web SG), created ASG (private subnets, min 2 / desired 2 / max 4, target tracking CPU 50%, 300s warm-up); stress-tested via load test button, watched CloudWatch alarm fire and ASG scale out to 4 instances

### EC2 Auto Scaling (deep dive), Route 53 & CloudFront (Fri Jun 12)

#### ASG Anti-Thrashing Mechanisms
| Mechanism | Purpose |
|-----------|---------|
| **Alarm Sustain Period** | Alarm must remain in breach for a specified duration before scaling |
| **Cooldown Period** | After a scaling event, no new action for set time (default 300s) |
| **Warm-Up Period** | New instance gets time to be ready before counted (default 300s) |

#### ASG Termination Policies
- **Terminate Newest First:** useful when a new config fails and must be removed quickly
- To **force** new launches → increase the **minimum capacity**
- If all new instances are failing → check the **Launch Template + AMI**

#### Amazon Route 53
- **AWS DNS service** — can distribute traffic **across regions** (ALB only distributes within a region)
- **Routing policies:**
  - **Simple:** basic single-resource routing
  - **Weighted:** % split across resources (e.g., 90/10 for blue-green deploy)
  - **Latency-based:** route to lowest-latency region
  - **Failover:** primary/secondary with automatic redirect
  - **Geolocation:** based on **user's location**
  - **Geoproximity:** based on **physical distance** to resources
  - **Multi-value answer:** up to 8 healthy random records
  - **IP-based:** routes by user IP block
- **Common exam trap:** Geolocation (user location) vs Geoproximity (physical distance) vs Latency (measured response time)

#### Amazon CloudFront (CDN)
- Global network of **Edge Locations** + **Regional Edge Caches**
- Speeds up static and dynamic web content delivery
- Reduces origin load — origin keeps 1 connection to the edge, edge fans out to viewers (critical for live streaming)
- Cost factors: request type, geographic location, data transferred out

#### Lab Highlights (Jun 12)
- **Lab 175:** Rebuilt Lab 174 architecture via CLI: launched EC2 via `aws ec2 run-instances` with user-data, created AMI from CLI, created ALB + Target Group (health check `/index.php`), created Launch Template (custom AMI, t3.micro), created ASG (private subnets, min 2/desired 2/max 4, target tracking CPU 50%, 300s warm-up); stress-tested via ALB DNS — 2 more instances launched when CPU > 50%

### IAM, S3 Static Website & ALB+ASG Labs (Sat Jun 13)

#### IAM Users, Credentials & Policies
- **IAM User** = an identity; has a User ID and User ARN
- **Creating a user alone is not enough** — must also:
  1. Add a **login profile** (console password) to enable sign-in
  2. Attach a **policy** (e.g., `AmazonS3FullAccess`) to grant permissions
- **Account ID + username + password** required to sign in as an IAM user
- **Secret Access Key** is shown **only once** at creation; cannot be retrieved later
- **Access keys (long-term)** vs **IAM Roles / Instance Profiles (preferred):** roles are temporary and auto-rotated

#### S3 Static Website Hosting
- Bucket names **globally unique**
- **Private by default** — public access requires:
  1. Disable **Block Public Access**
  2. Enable **ACLs** (Object Ownership)
  3. Add a **bucket policy** allowing public read
- Endpoint: `http://<bucket>.s3-website-<region>.amazonaws.com`
- **Automation:** `aws s3 sync` (only changed files) preferred over `aws s3 cp --recursive` (re-uploads all)

#### Labs 173 / 174 / 175 Highlights
- **Lab 173:** Walked through EC2 provisioning script (`create-ec2.txt`); discovered and fixed hardcoded region (used `$region` instead of `us-east-1`), wrong SG port (8080 → 80), and verified the app via order placement
- **Lab 174:** AMI from configured instance → ALB (web SG, target group :80) → Launch Template (custom AMI) → ASG (private subnets, min 2/desired 2/max 4, target tracking 50% CPU, 300s warm-up); load test triggered CloudWatch alarm and ASG launched 2 more instances
- **Lab 175:** Same as 174 but AMI built from CLI; used `EC2_ID=<id>` and `AMIID=<id>` environment variables; troubleshoot CLI errors from pasting the whole credential block or deleting user-data lines

### Key CLF-C02 Connections
- **IAM:** Users/Groups/Roles; identity-based vs resource-based policies; SCPs; MFA; Least Privilege
- **AWS CLI & SDK:** three access methods for AWS (Console, CLI, SDK)
- **AWS Systems Manager:** central management; Run Command, Session Manager, Parameter Store, Fleet Manager
- **CloudFormation:** Infrastructure-as-Code for reusable templates (contrast with IAM)
- **Automation philosophy:** automate repetitive tasks; use Python/CloudFormation/Terraform
- **Shared Responsibility:** You manage IAM users and policies; AWS manages the underlying service infrastructure
- **S3:** static website hosting, bucket naming (globally unique), endpoint URL format, storage classes (automation via CLI)
- **EC2:** instance types (T/C/R/X/P/G/Hpc), AMI, key pairs, security groups (stateful), instance store vs EBS, public IP vs Elastic IP, instance profile, user data, metadata service
- **VPC flow:** EC2 in public subnet can access internet via IGW; RDS typically placed in private subnet; security groups bridge between tiers
- **EC2 lifecycle:** terminated is permanent; stopped still incurs EBS storage cost
- **Instance Store vs EBS:** ephemeral vs persistent
- **Elastic Beanstalk:** PaaS, no extra charge, AWS manages OS/runtime/scaling
- **AMI deprecation:** ~2 years, blocks new launches (critical for ASGs)
- **Elastic Load Balancing:** ALB (L7), NLB (L4), GWLB (L3/4), CLB (legacy)
- **Auto Scaling Groups:** min/desired/max capacity; target tracking, step, simple, scheduled policies; cooldown, warm-up, alarm sustain
- **ASG termination policies:** newest first useful for failed new configs
- **Route 53:** 8 routing policies; Geolocation vs Geoproximity vs Latency distinction
- **CloudFront:** CDN with global edge locations + regional edge caches; reduces origin load via fan-out
- **CloudWatch:** alarms drive ASG scaling actions
- **IAM Roles for EC2:** preferred over access keys (no stored credentials, temporary)

---

## Daily Notes
- [June 8](./2026-06-08.md) — System Operations, AWS CLI, AWS Systems Manager, IAM Recap, Troubleshooting Knowledge Base
- [June 9](./2026-06-09.md) — S3 Static Website Hosting, EC2 Deep Dive (AMI, Instance Types, Key Pairs, Security Groups, IP Types, Instance Profile, User Data, Metadata), Lab Walkthrough
- [June 10](./2026-06-10.md) — EC2 Lifecycle & Billing, AMI Deprecation, Elastic Beanstalk, EC2 Launch via Console/CLI, VPC+SG Troubleshooting, Intro to ELB/ASG/Route 53
- [June 11](./2026-06-11.md) — Elastic Load Balancing (ALB/NLB/GWLB/CLB), Auto Scaling Groups, Decoupled Architecture, Labs 173 & 174
- [June 12](./2026-06-12.md) — ASG Anti-Thrashing & Termination Policies, Route 53 Routing Policies, CloudFront CDN, Lab 175
- [June 13](./2026-06-13.md) — IAM Users & Policies, S3 Static Website Hosting, Labs 173/174/175 Recap, IAM Roles vs Access Keys
