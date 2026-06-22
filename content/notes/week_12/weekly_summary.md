# Week 12 Summary — June 15–20, 2026
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

### Amazon VPC Deep Dive — Networking, Security & Connectivity (Thu Jun 18)

#### VPC Fundamentals
- **Amazon VPC** = a logically isolated virtual network in AWS, **Region-scoped**, can span all **AZs** in that Region
- A **subnet lives in exactly one AZ** (a subnet does not span AZs)
- Default VPC exists in every account; labs build a **custom ("lab") VPC** instead
- VPC CIDR block must be between **/16 and /28** using **RFC 1918** private ranges (10.x, 172.16–31.x, 192.168.x)
- AWS reserves **5 IPs per subnet** (network, VPC router, DNS, future, broadcast) — e.g., a `/27` (32) gives **27 usable**

#### Public vs. Private Subnets
- **Public subnet** = route table has `0.0.0.0/0 → Internet Gateway` (IGW)
- **Private subnet** = no IGW route; reaches internet only via **NAT Gateway** (outbound-only)
- **NAT Gateway** must live in a **public subnet**, requires an **Elastic IP**, supports TCP/UDP/ICMP, deploy across AZs for HA
- **NAT Instance** = self-managed alternative (you patch and scale it)

#### Routing & Gateways
- **Internet Gateway (IGW)** = direct, two-way internet for public subnets
- **Virtual Private Gateway (VGW)** = AWS-side endpoint of a VPN
- **Customer Gateway (CGW)** = customer-side endpoint of a VPN
- **Site-to-Site VPN** = encrypted tunnel over the internet to on-premises
- **AWS Direct Connect** = dedicated private line to AWS (can be paired with VPN)

#### VPC Connectivity Options
- **VPC Peering** = one-to-one private connection between two VPCs; **NOT transitive** (A↔B + B↔C ≠ A↔C)
- **Transit Gateway** = central hub for many VPCs and on-prem connections (avoids peering mesh)
- **VPC Endpoints** = private connection to AWS services without internet:
  - **Gateway Endpoint** = **only S3 and DynamoDB**, **free**
  - **Interface Endpoint (PrivateLink)** = other AWS services, **paid**

#### Security Groups vs. Network ACLs
| | Security Group (SG) | Network ACL (NACL) |
|---|---|---|
| Level | Instance | Subnet |
| Stateful | Yes (return traffic auto-allowed) | No (inbound + outbound rules separate) |
| Rules | Allow only | Allow + Deny |
| Evaluation | All rules evaluated | Lowest-numbered rule first, first match wins |
| Default inbound | Deny all | Allow all |

- **Bastion host** = public-subnet EC2 used as a secure jump box to reach private-subnet instances via SSH

#### DNS in a VPC
- **Route 53 Resolver** (AWS DNS), **custom DNS server**, or **Route 53 private hosted zone**
- **Enable "DNS hostnames"** on the VPC (VPC → Actions → Edit VPC settings) — easy to forget in labs

#### Lab 180 — Build a VPC from Scratch
- Create VPC `10.0.0.0/16`; enable DNS hostnames
- Create public + private subnets (`/24`) in `us-west-2a` (don't pick "No preference")
- Enable auto-assign public IPv4 on the **public** subnet only
- Create + attach an IGW; add route `0.0.0.0/0 → IGW` to the **public** route table
- Launch a **Bastion host** in the public subnet (Amazon Linux 2023, t3.micro)
- Create a **NAT Gateway** in the **public** subnet with an **Elastic IP**
- Add route `0.0.0.0/0 → NAT` to the **private** route table
- Launch a **private EC2** in the private subnet, SG allowing SSH from VPC CIDR
- Test: EC2 Instance Connect → bastion → SSH to private instance → `ping google.com` (proves NAT works)

#### VPC Troubleshooting Lab (Lab 181)
- **Two firewalls:** Security Group (instance-level, stateful) + Network ACL (subnet-level, stateless, numbered rules)
- **Challenge 1 — website unreachable:** SG looked OK (port 80 open); route table had **no IGW route** → **fix = add the IGW route**
- **Challenge 2 — SSH blocked:** SG allowed port 22 + routing fixed → check NACL → **Rule #40 DENY port 22** was evaluated **before** allow-all Rule #100 → **fix = delete Rule #40**
- **VPC Flow Logs** = capture accepted/rejected IP traffic to S3 (gzipped); use `gunzip` + `grep REJECT` to find blocked traffic; timestamps in **Unix epoch** (convert with `date -d @<timestamp>`)

#### Key CLF-C02 Connections
- **VPC** = isolated, Region-scoped virtual network (Domain 3)
- **Subnets are AZ-specific** (one subnet = one AZ)
- **Public vs. private subnet** + route to IGW vs. NAT Gateway
- **VPC Peering is non-transitive** (common exam gotcha)
- **Gateway Endpoint = free, only S3/DynamoDB**
- **VPN = encrypted** to on-prem; **Direct Connect = dedicated private line**
- **SG = stateful/instance-level/allow-only** vs. **NACL = stateless/subnet-level/allow+deny/numbered**
- **Bastion host** for secure access to private resources
- **VPC Flow Logs** for network monitoring/visibility

### Cloud Storage on AWS — EBS, EFS, S3, Snapshots, Snow Family (Fri Jun 19)

#### Storage Types — Block / Object / File / Hybrid
| Type | AWS service | Best for |
|---|---|---|
| **Block** | **EBS** | OS boot volumes, applications, databases |
| **Object** | **S3** | Files, images, video, backups, static websites |
| **File** | **EFS** / FSx | Shared file system across many instances |
| **Hybrid** | **Storage Gateway** | On-prem + cloud, DR, tiering |

- **CloudFront is NOT storage** — it's a CDN (common confusion)

#### Amazon EBS (Elastic Block Store)
- **Persistent block storage** attached to EC2 (survives stop/start)
- **Single-AZ (zonal)** service — volume attaches only to EC2 in the **same AZ**
- Can scale size up/down within minutes
- Used as boot volumes, data volumes, and **underneath RDS**

##### EBS Volume Types
| Category | Type | Best for |
|---|---|---|
| **SSD** | **io2 Block Express / io1** | I/O-intensive databases (highest IOPS, priciest) |
| **SSD** | **gp3 / gp2** | Boot volumes, virtual desktops, general purpose |
| **HDD** | **st1** (Throughput Optimized) | Streaming, big data, log processing |
| **HDD** | **sc1** (Cold) | Cheapest, infrequently accessed bulk |

- **Cost:** io2 > gp > st1 > sc1
- **IOPS** = operations/sec (databases); **Throughput** = data/sec (streaming)

#### EBS Snapshots & DLM
- **Snapshot** = point-in-time, **incremental** backup of an EBS volume (stored in S3)
- Can **copy cross-Region**, then create a new volume there
- **Data Lifecycle Manager (DLM)** automates creation, retention, deletion
- **Always set retention** — 24 snapshots/day = ~720/month, surprise bills otherwise
- DLM requires the **AWS Data Lifecycle Manager default role** (`aws dlm create-default-role`)

#### Instance Store
- **Ephemeral** block storage tied to the instance host — very fast
- **Stop or terminate → data is LOST**; reboot is OK
- Use only for **caching, buffers, scratch/temp data** — never for permanent data

#### Amazon EFS (Elastic File System)
- **Shared NFS file system** mounted by many EC2s at once — **Linux only**
- Auto-scales (no capacity management), petabyte-scale, low latency
- **EFS Standard / Standard-IA / One Zone** classes; performance & throughput modes
- **Use EFS for multi-EC2 shared file systems; FSx for Windows + Linux**

#### Amazon S3
- **Object storage**, **11 nines (99.999999999%) durability**, effectively unlimited capacity
- **Strong read-after-write consistency**
- Concepts: **bucket** (Region-scoped), **object**, **key** (unique within bucket)
- Events trigger **SQS / SNS / Lambda** (the S3 → Lambda → SNS pattern)
- S3 CLI: `aws s3 ls`, `cp`, `sync`, `rm`, `mb`

#### S3 Storage Classes
| Class | Use | Retrieval |
|---|---|---|
| **Standard** | Frequent access | Instant, no fee |
| **Intelligent-Tiering** | Unknown/changing patterns | Auto-moves objects between tiers |
| **Standard-IA** | Infrequent access | Retrieval fee |
| **One Zone-IA** | Reproducible infrequent data | Single AZ, lost if AZ fails |
| **Glacier Instant Retrieval** | Archive + immediate access | Milliseconds |
| **Glacier Flexible Retrieval** | Archive, occasional | Minutes–hours |
| **Glacier Deep Archive** | Long-term archive (audits) | **12–48 hours**, cheapest |

- **Archive tip:** zip many tiny files into one to reduce per-access cost
- **Frequent access to IA/Glacier can cost MORE than Standard** (retrieval fees)

#### S3 Features
- **Versioning:** keeps multiple versions; delete adds a **delete marker** (must be enabled *before* delete to protect the object)
- **Lifecycle:** auto-transition or expire objects on a schedule
- **Object Lock (WORM):** **retention period** (cannot delete for N days) or **legal hold** (indefinite until removed) — compliance/governance
- **Security:** private by default; **Block Public Access**; **pre-signed URLs** for time-limited access; **CORS** for static websites

#### Storage Gateway & Snow Family
- **Storage Gateway** = hybrid connection between on-prem and AWS storage (DR, tiering, migration)
- **Snow Family** = physical devices AWS ships to you for offline bulk transfer
- **Why Snow?** 50 TB over 100 Mbps ≈ 12.5 MB/s = **weeks/months** — ship a device instead

#### Lab 182 — EBS Volumes & Snapshots (Console)
1. Note instance's AZ
2. Create EBS volume in **same AZ** (gp2, 1 GB) and **attach** as `/dev/sdb`
3. SSH in → `mkfs -t ext3 /dev/sdb` → `mount /dev/sdb /mnt/datastore` → write files
4. **Snapshot** → delete files → create new volume from snapshot → attach + mount → files restored (file system intact)

#### EBS Snapshots via CLI + S3 Versioning Lab
- Stop instance (root volume) → snapshot → start
- Cron = snapshots pile up fast (cost demo)
- **boto3** script keeps only the **last 2 snapshots** (cost/retention)
- **S3 versioning challenge:** enable versioning **before** uploading, then `aws s3 sync --delete` → delete marker added → restore with `--version-id`

#### Key CLF-C02 Connections
- **Block (EBS) vs. Object (S3) vs. File (EFS)** — core storage comparison
- **EBS = single-AZ, persistent**; **Instance store = ephemeral, lost on stop/terminate**
- **EBS snapshots** are S3-backed, incremental, cross-Region-copyable
- **DLM** automates snapshot retention (cost optimization)
- **EFS = shared, NFS, Linux-only**; **FSx = Windows + Linux**
- **S3 = 11 nines durability**; **Strong read-after-write consistency**
- **S3 storage classes** trade cost for retrieval — **Deep Archive = 12–48 hr** (cheapest)
- **Intelligent-Tiering** auto-moves objects by access pattern
- **Versioning + Object Lock (WORM)** for data protection and compliance
- **Snow Family** for offline bulk transfer when bandwidth is insufficient

### Lab Day — Route 53 Failover, Lambda + S3, EC2→RDS Migration, VPC Troubleshooting (Sat Jun 20)

#### Lab 176 — Route 53 Failover Routing (recap)
- Primary EC2 in `us-west-2a`, secondary EC2 in `us-west-2b` (different AZs for resilience)
- Health check: monitor by IP, path `/cafe`, **threshold = 2**
- **Primary A record** = Failover routing + health check; **Secondary A record** = Failover routing, no health check
- **TTL = 15s** so failover propagates quickly
- **Test:** stop primary → health check fails 2x → traffic switches to secondary → restart primary → traffic returns

#### Lab 177 — Lambda Triggered by S3 (recap)
- Pipeline: `S3 (.txt upload) → Lambda (count words) → SNS topic → Email`
- **IAM execution role gotcha:** creating Lambda with "no permissions" tries to create a new IAM role and fails → **use an existing IAM role** instead
- **S3 trigger:** event = *all object create*, **suffix = `.txt`** (acknowledge recursive-invocation warning)
- **Env var** `TOPIC_ARN` = the SNS topic ARN
- **Gotchas:**
  - **Spaces in filenames** → `NoSuchKey` (escape with `\` or rename)
  - **SNS subscriptions auto-deactivate** for non-business domains → re-confirm
  - Starter code counted characters, not words — fix with `content.split()`
- **Lambda destinations** (on-failure → SNS) for debugging failed invocations

#### Lab 179 — Migrating Database to Amazon RDS (recap)
- **Architecture change:** website stays on EC2; only the **database** moves to RDS (managed)
- Steps (mostly via AWS CLI on a CLI host):
  1. `aws configure` on the CLI host
  2. Create **DB security group** + inbound rule allowing **web SG as source** (tier-to-tier)
  3. Create **2 private subnets in different AZs** with different CIDRs
  4. Create **DB subnet group** (RDS requires ≥2 AZs)
  5. Create RDS instance via CLI; poll until `available`; note the endpoint
  6. On the **cafe instance**: `mysqldump` → download `global-bundle.pem` → import to RDS endpoint
  7. Verify with `SHOW TABLES` / `SELECT * FROM product;`
  8. Repoint app: update **Parameter Store** `cafe/dbUrl` → RDS endpoint
  9. Drop the old DB on EC2 to prove data now lives in RDS
- **Gotchas:** wrong host (CLI vs. cafe); reserved SQL word `order` (use `cafedb.order`)

#### Lab 181 — VPC Troubleshooting + VPC Flow Logs (recap)
- **Two firewalls:** Security Group (instance-level, stateful) vs. Network ACL (subnet-level, stateless, **lowest-numbered rule first**)
- **Challenge 1 — website unreachable:** SG was fine; route table was **missing the IGW route** → added it
- **Challenge 2 — SSH blocked:** SG allowed port 22; routing fixed; **NACL Rule #40 DENY port 22** evaluated before allow Rule #100 → deleted Rule #40
- **VPC Flow Logs analysis:**
  - Download gzipped logs from S3 → `gunzip` (NOT `unzip`)
  - `grep REJECT` → 832 rejects, 115 on port 22 (the blocked SSH attempts)
  - Convert Unix epoch timestamps with `date -d @<timestamp>`

#### Key CLF-C02 Connections
- **Route 53 failover** + multi-AZ = high availability + disaster recovery
- **CloudWatch alarms + SNS** = monitoring and notification combo
- **Lambda + S3 events + SNS** = canonical serverless event-driven pattern
- **IAM execution roles** so services can act on your behalf
- **Amazon RDS** = managed DB; AWS handles backups/patching; place in private subnets
- **DB subnet group** spans ≥2 AZs; DB SG references web SG as source
- **Security Groups vs. NACLs** — most-tested security distinction
- **NACL rule ordering / lowest-number-first** — common gotcha
- **VPC Flow Logs** = network monitoring to S3
- **Three AWS access methods:** Console, CLI, SDK (boto3)

---

## Daily Notes
- [June 15](./2026-06-15.md) — AWS Lambda, Route 53 Failover Routing (Lab 176), Lambda + SNS Sales Report (Lab 178), REST API Fundamentals
- [June 16](./2026-06-16.md) — REST API Requests/Status Codes, API Gateway, Step Functions, Containers vs VMs, Docker, AWS Container Services (ECR/ECS/EKS/Fargate), Lab 177 (S3→Lambda→SNS), Lab 179 (EC2→RDS)
- [June 18](./2026-06-18.md) — Amazon VPC Deep Dive, Subnets/Routing/Gateways, VPC Peering/Transit Gateway/VPN/Direct Connect, Security Groups vs. NACLs, Bastion Hosts, Lab 180 (Build a VPC), VPC Troubleshooting Lab
- [June 19](./2026-06-19.md) — Cloud Storage Types, Amazon EBS, Snapshots & DLM, Instance Store, Amazon EFS, Amazon S3, S3 Storage Classes & Intelligent-Tiering, Versioning/Object Lock, Storage Gateway, Snow Family, Lab 182 (EBS), S3 Versioning Lab
- [June 20](./2026-06-20.md) — Lab Day Recap: Route 53 Failover (Lab 176), Lambda + S3 (Lab 177), EC2→RDS Migration (Lab 179), VPC Troubleshooting + Flow Logs (Lab 181)
