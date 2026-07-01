# Week 13 Summary — June 22–25, 2026
**AWS re/Start Cohort 3: Project CloudIgnite**

---

## What We Learned

### S3 Glacier, Storage Gateway, Migration Services, S3 Labs & CloudWatch Intro (Mon Jun 22)

#### Amazon S3 Glacier (Archive Storage)
- Low-cost storage for **data archiving** — cheap storage, expensive retrieval
- **Three Glacier classes:** Instant Retrieval (ms), Flexible Retrieval (min–hrs), Deep Archive (up to 48 hrs)
- **Retrieval options (Flexible):** Expedited (1–5 min), Standard (3–5 hrs), Bulk (5–12 hrs)
- **Glacier vocabulary:** Vault = container; Archive = stored item; Job = retrieval operation
- **Encryption is enabled by default** (unlike S3 Standard); Vault access policies + KMS supported
- **Best practice:** zip many tiny files into one before archiving (fewer retrieval operations = lower cost)

#### AWS Storage Gateway (Hybrid Storage)
- Connects on-premises data center to AWS cloud storage; deployed as VM or hardware appliance
- **Three gateway types:**
  - **File Gateway** → S3/FSx (NFS/SMB) — like network drive; supports lifecycle to S3-IA or Glacier Flexible (not Deep Archive)
  - **Volume Gateway** → EBS (iSCSI) — acts like local disk; stores EBS snapshots
  - **Tape Gateway** → S3 Glacier (VTL) — for archive/virtual tapes

#### Data Transfer & Migration Services
- **AWS Transfer Family:** managed SFTP/FTPS into S3 or EFS
- **AWS DataSync:** online data transfer + two-way sync (on-prem ↔ cloud, service ↔ service); uses DataSync agent + VPN/Direct Connect
- **Storage Gateway vs DataSync:** Gateway = access cloud storage like local drive (persistent); DataSync = actively copy/sync data (automated)
- **Snow Family (physical transfer):** Snowcone (tens of TB), Snowball/Edge (up to ~210 TB, Edge adds compute), Snowmobile (petabyte/exabyte truck)

#### Lab 185 — S3 Secure File Sharing + SNS Notifications
- **Scenario:** external media co. uploads photos; email notification on upload/delete
- **Workflow:** S3 bucket → SNS topic + email subscription → SNS topic policy allowing S3 to publish → S3 event notification (ObjectCreated/Removed)
- **Gotchas:** malformed SNS access policy (stray character in ARN) → "Unable to validate destination config"; IAM permission propagation delay; access keys shown once (download CSV immediately)

#### Lab 184 — S3 via CLI (Pre-Signed URLs)
- Create bucket, upload objects with `aws s3 sync`, attempt browser access (blocked)
- **Solution:** pre-signed URL (owner credentials + expiry time) — temporary, authenticated access to single object without making bucket public
- **List objects:** `aws s3 ls s3://<bucket>` + `--recursive` for nested folders

#### Amazon CloudWatch (Monitoring)
- **Standard metrics** (no setup): CPU, network, disk
- **Custom metrics** (require CloudWatch agent): RAM/memory utilization, disk space details
- **Monitoring frequency:** Basic (5-min, free) vs Detailed (1-min, extra cost)
- **Alarms:** three states (OK/ALARM/INSUFFICIENT_DATA); trigger after threshold breached for N data points; actions = EC2 (stop/terminate/reboot/recover), Auto Scaling, SNS
- **Log organization:** Namespace (service), Dimension (name/value pair identifying a metric), Period (aggregation window)

#### Key CLF-C02 Connections
- **Glacier storage classes + retrieval times** — frequently tested (standard = 3–5 hrs)
- **Storage Gateway types** — File → S3, Volume → EBS, Tape → Glacier
- **Snow Family sizing** — Snowcone smallest, Snowmobile petabyte
- **DataSync vs Transfer Family vs Snow Family** — pick the right migration service
- **Pre-signed URLs** — temporary secure S3 access
- **CloudWatch** — standard vs custom metrics (RAM needs agent); basic vs detailed monitoring; alarm states

### CloudWatch Deep Dive, CloudTrail, AWS Organizations & Labs (Tue Jun 23)

#### Amazon CloudWatch (Deep Dive)
- **Metric structure:** Namespace (AWS/S3), Dimension (StorageType = Glacier), Period (1 min/5 min)
- **Standard vs custom:** RAM/memory utilization is NOT standard — requires CloudWatch agent (frequently tested)
- **Dashboards, anomaly detection, CloudWatch Logs** (log groups, export to S3)
- **Metric filters:** filter for specific log entries (e.g., HTTP 404) → turn into a metric
- **Alarms** → SNS/Lambda/Auto Scaling actions
- **EventBridge** is the current name (CloudWatch Events deprecated)

#### AWS CloudTrail
- **Records API/user activity** — "who did what" audit log
- **Simple rule:** resource issue → CloudWatch; user issue → CloudTrail (like CCTV for your account)
- Logs stored in **S3** and queried with **Amazon Athena** (serverless SQL over S3)
- **CloudWatch vs CloudTrail vs Config:** CloudWatch = resource health; CloudTrail = user activity audit; Config = resource compliance

#### AWS Organizations
- Centrally manage many AWS accounts with **consolidated billing**
- **Components:** Root (management account), OU (group of accounts, up to 5 levels nested), Member account, SCP (restricts services per OU)
- **SCPs** limit which services/actions an OU can use (IAM + resource policies + SCP = three security layers)
- **Consolidated billing** = one bill for org, cost view per OU; volume discounts
- Not same as Windows Server Active Directory

#### Lab 186 — Monitoring Infrastructure with CloudWatch
- **Task 1:** Install CloudWatch agent via Systems Manager Run Command (AWS-ConfigureAWSPackage) + Parameter Store config
- **Task 2:** Generate HTTP 404 → CloudWatch Logs → metric filter (namespace LogMetrics, name 404 errors, value 1) → alarm (period 1 min, >= 5) → SNS email
- **Task 3:** View collected metrics in CloudWatch (agent namespace for disk/host data)
- **Task 4:** EventBridge rule (EC2 state change → SNS topic) — check "Use execution role" → can fail if unchecked
- **Task 5:** AWS Config rules (required-tags, ec2-volume-inuse-check) → flags non-compliant resources

#### Lab — "Catch the Hacker" (CloudTrail + Athena) Start
- Security group tampered (extra SSH rule, defaced website)
- Create CloudTrail trail → logs to S3 → SSH to instance → download logs via CLI (`aws s3 cp --recursive`) → unzip → grep raw JSON (painful) → motivation for Athena next session

#### Key CLF-C02 Connections
- **CloudWatch:** standard vs custom metrics; RAM needs CloudWatch agent; basic (5-min) vs detailed (1-min); alarm states
- **CloudTrail:** audit of API/user activity; contrast with CloudWatch and Config
- **AWS Organizations:** OUs, SCPs, consolidated billing — high exam relevance
- **AWS Config:** resource compliance auditing
- **EventBridge:** event-driven routing (formerly CloudWatch Events)
- **CloudWatch agent:** required for custom metrics (RAM, disk)

### Tagging, Catch the Hacker Lab, Cost Management, SageMaker ML & KCs (Wed Jun 24)

#### Resource Tagging
- **Tags** = key/value labels (up to 50 per resource, case-sensitive) for categorization, automation, cost tracking
- **Enforcement:** AWS Config (required-tags rule) + IAM (require tags at creation via policy conditions)
- **CLI:** create-tags; filter instances by tag: `--filters "Name=tag:project,Values=ERP system"`
- **Best practices:** group by technical/business/security dimensions; prefer more tags; use standardized naming; automate management

#### Lab 187 — Catch the Hacker (CloudTrail + Athena) Complete
- **Tasks:** secure own SSH access (My IP only) → confirm attack (3rd SSH rule + defaced image) → create CloudTrail trail → SSH to download logs → inspect raw JSON
- **Athena analysis:** create Athena table over logs → SQL query (WHERE eventname = 'AuthorizeSecurityGroupIngress') → identify culprit = IAM user 'chaos'
- **Remediation:** userdel + kill -9 to evict; disable password auth in sshd_config; delete malicious SG rule; restore defaced image; delete IAM user (deactivate key first)

#### Cost Management (Intro)
- **Tools:** Billing Dashboard (snapshot), Cost Explorer (visualize trends), Budgets (threshold + forecast alerts, notify-only, doesn't stop resources), CUR (detailed line items), billing alarm via CloudWatch + SNS
- **Cost-reduction:** right-size instances; use Lambda for spiky workloads; managed databases; stop non-prod after hours; tags for cost allocation

#### Lab 316 — Machine Learning with Amazon SageMaker
- **Goal:** train ML model on orthopedic biomechanical dataset to predict normal vs abnormal
- **Workflow:** load dataset (310 rows, 6 features) → split (248 train / 31 test / 31 validate) → configure estimator on ml.m4.xlarge (compute-heavy) → training job
- **SageMaker** = managed ML service (build, train, deploy)

#### Exam-Scenario Knowledge Check Recap
- **EC2 first launch step:** determine AMI
- **Graph/connected data** → Neptune; **big-data warehouse** → Redshift; **caching** → ElastiCache; **NoSQL** → DynamoDB; **relational** → Aurora/RDS
- **NAT gateway:** needs route table, Elastic IP, public subnet (second NAT = redundancy, not required)
- **SCP max size:** 5120 characters
- **Data sovereignty:** provide auditor access per region's data-residency rules

#### Key CLF-C02 Connections
- **Tags:** cost allocation (50-tag limit, case-sensitive); AWS Config + IAM enforcement
- **CloudTrail + Athena:** audit trail + serverless SQL analysis
- **Cost Explorer / Budgets / CUR / billing alarms:** Billing & Pricing pillars
- **AWS Budgets:** alerts + forecast, doesn't stop usage (frequently tested nuance)
- **SageMaker:** managed ML service
- **Database keyword map:** Neptune (graph), Redshift (warehouse), DynamoDB (NoSQL), Aurora (relational)
- **NAT gateway:** routing, public subnet, Elastic IP
- **SCP max size (5120):** governance detail

### Cost Optimization, Trusted Advisor, Support Plans & Labs (Thu Jun 25)

#### Cost Optimization Strategies
- **Right-size instances:** match type to need; prefer T2/T3 general-purpose
- **Lambda for spiky/low compute:** pay per execution vs EC2 24/7 billing
- **Managed databases:** RDS (SQL), DynamoDB (NoSQL)
- **Eliminate waste:** CloudWatch metrics for idle instances → terminate/downsize
- **Stopinator script:** start/stop EC2 on a schedule (e.g., 10 AM start, 11 PM stop)

#### AWS Trusted Advisor
- **Five pillars:** Cost Optimization, Performance, Security, Fault Tolerance, Service Limits
- **Traffic-light status:** Green (ok), Yellow (check/review), Red (act now)
- **Free tier:** core checks only; full/advanced checks need Business or Enterprise Support

#### AWS Support Plans
- **Basic (free):** docs, forums, Personal Health Dashboard, 6 core Trusted Advisor checks — **NO technical case support**
- **Developer (~$29/mo):** business-hours email, one primary contact
- **Business (~$100/mo):** 24/7 email/chat/phone, unlimited contacts + cases, full Trusted Advisor
- **Enterprise (~$15,000/mo):** dedicated TAM, <15-min critical response, Concierge
- **Response SLAs:** General guidance = 24h all; System impaired = 12h all; Production down = 1h (Business/Enterprise); Critical = <15 min (Enterprise only)

#### AWS Whitepapers & Documentation
- Free self-service resources (available to all, including Basic support)

#### Knowledge Checks
- **Cost Management:** AWS Organizations = consolidated billing; AWS Config = tag enforcement; Budgets = spend alerts; SCP = access control across accounts/OUs
- **Cloud Computing:** pay-as-you-go; economies of scale (aggregated demand → bulk buying → lower prices); NOT benefits = high latency, long procurement cycles; cloud = speed/agility, fault tolerance, high availability
- **Global Infrastructure:** CloudFront uses Edge Locations for low latency; Region = 2+ AZs in geographic area; AZ = isolated fault domain (1+ data centers); AZs connected by low-latency private links; AWS recommends multi-AZ deployment

#### Lab 188 — Tagging AWS Resources (CLI)
- Filter by tag: `aws ec2 describe-instances --filters "Name=tag:project,Values=ERP system"`
- Query specific fields: `--query "Reservations[].Instances[].[InstanceId,InstanceType,SubnetId]"`
- **Stopinator script (PHP):** starts/stops EC2 matching specific tags; `-s` to start instead of stop
- **Terminate script:** terminates all EC2 without environment tag in a specific subnet
- **Pro tip:** tag discipline affects safety — mis-tagged production box could be wrongly terminated

#### Lab 189 — Cost Optimization & Pricing Calculator
- Downsize cafe instance (T3 small → T3 micro) to cut cost
- **AWS Pricing Calculator:** no login required; create estimate by region + services; comparison showed ~$100/year savings by downsizing
- **RDS minimum storage:** 20 GB (can't go lower)

#### Key CLF-C02 Connections
- **Cost optimization:** right-sizing, Lambda for variable demand, managed services, idle cleanup
- **Trusted Advisor:** 5 pillars; full checks need Business/Enterprise
- **Support plans:** TAM = Enterprise only; 24/7 phone = Business+; <15-min = Enterprise
- **AWS Pricing Calculator:** estimate before deploying
- **Cloud benefits:** economies of scale, stop guessing capacity, no hardware, speed/agility, go global in minutes
- **Global infrastructure:** Regions (2+ AZs), AZs (1+ data centers), Edge Locations (CloudFront)

---

## Daily Notes
- [June 22](./2026-06-22.md) — S3 Glacier, Storage Gateway, Transfer Family, DataSync, Snow Family, Lab 185 (S3+SNS), Lab 184 (S3 CLI + Pre-Signed URLs), CloudWatch Intro
- [June 23](./2026-06-23.md) — CloudWatch Deep Dive, CloudTrail, AWS Organizations, Lab 186 (Monitoring Infrastructure), Catch the Hacker Lab Start (CloudTrail + Athena)
- [June 24](./2026-06-24.md) — Resource Tagging, Lab 187 (Catch the Hacker Complete), Cost Management Intro, Lab 316 (SageMaker ML), Exam-Scenario KCs
- [June 25](./2026-06-25.md) — Cost Optimization, Trusted Advisor, AWS Support Plans, Cloud Computing & Global Infrastructure KCs, Lab 188 (Tagging CLI), Lab 189 (Pricing Calculator)
