# Week 12 Summary — June 15–16, 2026
**AWS re/Start Cohort 3: Project CloudIgnite**

---

## What We Learned

### AWS Lambda, Route 53 Failover & REST API Foundations (Mon Jun 15)

#### AWS Lambda — Serverless Compute
- **Serverless ≠ no servers** — AWS manages them; you only build code and monitor the application
- Closer to **PaaS** than IaaS: EC2 = IaaS, Lambda = serverless/PaaS
- **Key characteristics:**
  - **Event-driven** — triggered by S3, API Gateway, EventBridge, etc.
  - **Sub-second metering / pay-for-use** — only pay for execution time, never for idle
  - **15-minute max execution time per invocation** (not daily); long tasks error out
  - **Automatic scaling** — no scaling config needed for 5, 50, or 1,000+ concurrent users
  - Supports **multiple runtimes** (Python, Node.js, Java, etc.)
- **Develop & deploy steps:** Create handler → Create function (Console/CLI) → Assign IAM execution role → Upload code → Invoke to test → Monitor with CloudWatch
- **Lambda Layers** package shared libraries/dependencies separately from the handler
- **Free tier:** 1M requests/month

#### Amazon Route 53 Failover Routing (Lab 176)
- **Route 53** = AWS managed DNS service
- **Failover routing** = active/passive: primary handles traffic, secondary takes over if health checks fail
- **Lab build:**
  - Two EC2 instances (primary in `us-west-2a`, secondary in `us-west-2b`)
  - Health check: monitor by IP, path `/cafe`, interval 10s, threshold 2
  - DNS records: two A records (primary + secondary), TTL 15s, Failover routing policy
- **Failover test:** stop primary → health check fails 2x → traffic routes to secondary; restart primary → routes back
- **Best practice:** put primary and secondary in **different AZs** for true fault tolerance
- **Optional:** CloudWatch alarm + SNS email notification on unhealthy status

#### Lambda + SNS Sales Report (Lab 178)
- **Goal:** scheduled daily report emailed via SNS (data from DB)
- **Architecture:** EventBridge cron → Lambda (+ PyMySQL layer) → RDS MySQL → SNS topic → email
- **Build steps:**
  - Create/inspect IAM roles (least privilege for CloudWatch Logs)
  - Create Lambda Layer (PyMySQL, Python 3.10)
  - Create extractor Lambda from scratch with custom execution role
  - Configure VPC (Cafe VPC, public subnet 1, Cafe SG)
  - Pull DB credentials from **Parameter Store** (`cafe/dbUrl`, etc.)
  - **Fix #1:** add **inbound rule for MySQL port 3306** to DB security group
  - Create **Standard SNS topic** + Email subscription (confirm)
  - Use `lambda create-function` CLI with correct **IAM role ARN** (not SNS topic ARN)
  - Set environment variable `topicARN` = SNS topic ARN (casing matters)
  - Add EventBridge cron trigger
- **ARN gotcha:** IAM role ARN ≠ SNS topic ARN ≠ SNS subscription ARN
- **Casing matters** for env var keys (`topicARN`)

#### REST API Fundamentals
- **API** = programmatic way for apps to communicate (machine-readable JSON)
- **REST** = REpresentational State Transfer — stateless, HTTP-based
- **Constraints:** Uniform interface, Stateless, Cacheable, Layered system, Code on demand, Client–server separation
- **Stateless:** every request independent; server keeps no memory of prior requests
- **Low direct CLF-C02 relevance** but important for understanding API Gateway and Lambda

#### Key CLF-C02 Connections
- **Lambda** = serverless compute; pay-per-execution (vs. EC2 pay-per-hour)
- **Shared Responsibility** shifts further to AWS with Lambda (AWS handles OS, scaling, infra)
- **Route 53** = DNS service; failover routing = high availability
- **Multi-AZ design** = fault tolerance principle
- **IAM execution roles** for Lambda (least privilege)
- **Parameter Store** for credentials (don't hard-code)
- **CloudWatch** for monitoring/observability
- **SNS** for pub/sub notifications
- **EventBridge** for cron scheduling

### REST APIs, API Gateway, Step Functions, Containers, Docker & RDS (Tue Jun 16)

#### REST API Requests, Responses & Status Codes
- **HTTP request anatomy:** Method + URL + Headers + (optional) Body
- **HTTP methods (REST verbs):**
  - **GET** = read, **POST** = create, **PUT** = update, **DELETE** = remove
- **Status code families:**
  - **1xx** informational
  - **2xx** success (200 OK, 201 Created, 202 Accepted)
  - **3xx** redirect
  - **4xx** client error (401 Unauthorized, 403 Forbidden, 404 Not Found)
  - **5xx** server error (500, 502)
- **cURL** for testing: `curl -X POST -d @file.json -H "Content-Type: application/json" <URL>`

#### Amazon API Gateway
- **Managed service** to create, publish, maintain APIs (REST + others)
- Pairs with **Lambda** for serverless APIs
- Provides a **URL endpoint** that fronts multiple backends: Lambda, EC2, DynamoDB, Kinesis, VPC resources
- Supports **API Gateway cache** (cache miss → forward to backend)
- Benefits: performance at any scale, tiered pricing, security controls

#### AWS Step Functions
- **Serverless orchestration** of workflows (state machine)
- Useful when **one task depends on another** (ordering, parallelism + join)
- **Building blocks:** state machine (workflow), state (step), **task** (work performed)
- **Sequential vs. parallel:**
  - Sequential: Task 1 → Task 2 → Task 3
  - Parallel: Task 1 + Task 2 run together; Task 3 waits for both
  - Example: account opening — validate name + validate address (parallel) → open account (join)
- **Exam fact:** in Step Functions, a **Task** performs the work; the state machine is the workflow
- Benefits: auto-scaling, high availability, pay-per-use

#### Containers vs. Virtual Machines
- **Container** = app + dependencies in a resource-isolated process sharing the host OS kernel
- **VM** = full guest OS on a hypervisor (heavier, GB-sized, slower start)
- **Key difference:** container shares host OS kernel; VM has its own guest OS
- **Stack:**
  - VM: Hardware → Host OS → Hypervisor → [Guest OS + App]
  - Container: Hardware → Host OS → Docker Engine → [Container (app + deps)]
- **House analogy:** VM = landed house (full plumbing/electricity); container = apartment (shares building infrastructure)
- **Why containers matter:**
  - Solve "works on my machine" — environment bundled with code
  - Conflicting dependencies: run Python 3.7 and Python 3.11 apps side-by-side in separate containers
- **Benefits:** environment consistency, process isolation, operational efficiency, immutable artifacts (rollback friendly)

#### Docker
- **Docker** = platform to build, manage, and run containers
- **Components:**
  - **Dockerfile** = blueprint (base OS, apps, env vars)
  - **Docker image** = built artifact (immutable)
  - **Registry** = where images are stored (Docker Hub, ECR)
  - **Container** = running instance of an image
  - **Host** = machine Docker runs on
- Not AWS-specific — can install and practice on your laptop

#### AWS Container Services
| Service | Role |
|---------|------|
| **Amazon ECR** | Managed Docker image registry (like Docker Hub) |
| **Amazon ECS** | AWS-native Docker container orchestration |
| **Amazon EKS** | Managed Kubernetes on AWS |
| **AWS Fargate** | Serverless compute for containers (no EC2 to manage) |
- Containers run on **EC2 under the hood**
- **Compute choices for ECS/EKS:**
  - **Fargate** = serverless (AWS manages EC2, scaling, patching)
  - **Your own EC2 cluster** = cheaper but you patch & scale
- EKS integrates with: ELB, IAM, VPC, PrivateLink, CloudTrail

#### Lab 177 — S3 → Lambda → SNS (Word Count)
- **Goal:** `.txt` upload to S3 → Lambda counts words → email via SNS
- **Architecture:** S3 event (suffix `.txt`) → Lambda → SNS topic → email
- **Build steps:**
  - Create **Standard** SNS topic + Email subscription
  - Create S3 bucket
  - Create Lambda (Python 3.10) with custom execution role
  - Add S3 trigger (suffix `.txt`)
  - Set env var `topicARN` = SNS topic ARN
  - Use **boto3 SDK** in code (S3 client + SNS client)
  - **Bug fix:** `content.split()` for words, not character count
- **Three ways to interact with AWS:** Management Console, CLI, SDK
- **Lambda destinations:** send result to another target on success/failure

#### Lab 179 — Migrate Database from EC2 to Amazon RDS
- **Problem:** self-managed DB on EC2 → manual backups/patches/verification
- **Solution:** migrate to **Amazon RDS** (managed) — AWS handles backups, patching, maintenance
- **Architecture change:** website stays on EC2; only the database moves to RDS
- **Build steps (mostly CLI):**
  - Place test order
  - `aws configure` on CLI host
  - Create DB security group + port 3306 inbound rule
  - Create **2 private subnets in different AZs** with different CIDR blocks
  - Create **DB subnet group** (RDS requires ≥2 AZs)
  - Create RDS instance via CLI; poll until available for endpoint
  - On the **cafe instance**: `mysqldump` backup → download `global-bundle.pem` → import to RDS
  - Verify with `SELECT * FROM product;`
  - Update `cafe/dbUrl` in Parameter Store to RDS endpoint
- **Critical gotchas:**
  - **Run commands on the correct host** (CLI host vs. cafe instance) — the #1 failure
  - **VPC ID vs. Security Group ID** (vpc- vs. sg- prefix)
  - **Different CIDR blocks** for the two subnets
  - **Don't stop/delete the EC2 instance** — website still lives there
  - Fix cascading failures step-by-step (later commands depend on earlier ones)

#### Key CLF-C02 Connections
- **Amazon API Gateway** = managed APIs; often paired with Lambda (serverless APIs)
- **AWS Step Functions** = serverless workflow orchestration; **Task** performs work
- **Containers vs. VMs** = containers lightweight/portable; VMs have full guest OS
- **ECR / ECS / EKS / Fargate** = AWS container services (commonly tested)
  - ECR = registry, ECS = Docker orchestrator, EKS = managed Kubernetes, Fargate = serverless containers
- **S3 → Lambda → SNS** = canonical event-driven serverless pattern
- **Amazon RDS** = managed relational DB (Shared Responsibility in action)
- **VPC, subnets, multi-AZ, security groups, ports** = core networking/security
- **Three ways to access AWS:** Console, CLI, SDK (boto3)
- **Parameter Store** for config/secrets (don't hard-code)
- **HTTP methods & status codes** = general web knowledge, not core CLF-C02

---

## Daily Notes
- [June 15](./2026-06-15.md) — AWS Lambda, Route 53 Failover Routing (Lab 176), Lambda + SNS Sales Report (Lab 178), REST API Fundamentals
- [June 16](./2026-06-16.md) — REST API Requests/Status Codes, API Gateway, Step Functions, Containers vs VMs, Docker, AWS Container Services (ECR/ECS/EKS/Fargate), Lab 177 (S3→Lambda→SNS), Lab 179 (EC2→RDS)
