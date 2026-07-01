# Week 14 Summary — June 29 – July 1, 2026
**AWS re/Start Cohort 3: Project CloudIgnite**

---

## What We Learned

### AMIs, Launch Templates, IaC, JSON vs YAML & CloudFormation (Mon Jun 29)

#### Amazon Machine Images (AMIs)
- **AMI** = blueprint/snapshot used to launch EC2 instances (OS + optional software + EBS config)
- **Build time vs boot time trade-off:** Full AMI = longer build/fastest boot; Partially configured = balanced; OS-only = fastest build/slowest boot
- **Key AMI facts:** Regional service (must copy to use elsewhere); creating AMI reboots source instance by default; Windows needs Sysprep (Generalize → Specialize → OOBE)
- **User data vs AMI:** AMI = blueprint; user data = script that configures at launch

#### Launch Templates
- **Launch template** = full recipe (AMI + instance type + subnet + key pair + optional SG) with versioning
- Great with Auto Scaling for repeatable launches

#### Infrastructure as Code (IaC)
- IaC = defining/provisioning infrastructure through code/templates (CloudFormation on AWS)
- **CloudFormation vs bash script:** bash blindly recreates; CloudFormation is **incremental** (detects changes, only creates what's new)
- CloudFormation enables **rollback**, **drift detection**, and documentation

#### JSON vs YAML
- JSON = {} objects/[] arrays, no comments, more verbose, good for transport
- YAML = indentation-based, supports comments, more human-readable, preferred for config
- **YAML uses spaces, never tabs** — 2-space indentation; extra space/missing colon = syntax error

#### AWS CloudFormation — Deep Dive
- **Core:** Template (code/program) → Stack (running instantiation) → Change set (preview of updates)
- **Template sections:** Parameters, Mappings, Resources (required), CreationPolicy/cfn-init, WaitCondition, Outputs
- **Behavior:** automatic rollback on error; termination protection; DependsOn for ordering
- **Best practices:** organize stacks by lifecycle; reuse templates; verify service limits; never embed credentials; create change set before updating; use stack policies and revision control

#### Lab 190 — CloudFormation Change Sets (S3 + EC2)
- Started from base template (VPC, IGW, route table, subnet using Ref + DependsOn)
- **Task 2:** edit YAML → create change set (previews only bucket added) → execute (incremental, VPC untouched)
- **Task 3:** add AMI parameter → AWS::EC2::Instance → change set → execute → EC2 launches
- **Gotchas:** missing colon → regex validation error; YAML indentation must be exactly 2 spaces

#### Key CLF-C02 Connections
- **AMI** = blueprint, region-scoped (Domain 3); **Launch templates** = versioned standard config
- **CloudFormation** = IaC with templates/stacks/change sets — frequently tested
- **Automatic rollback** on error; **incremental updates** via change sets
- **No credentials in templates** — security best practice

### CloudFormation Troubleshooting, Drift, Stack Deletion & KCs (Tue Jun 30)

#### CloudFormation Troubleshooting
- **Systematic approach:** --on-failure DO_NOTHING → read instance logs → classify root cause → fix and re-deploy
- **Common failures:** missing IAM permission, typo in user-data, missing parameter, syntax error, URL returning 403/404
- **Logs:** /var/log/ on Linux (cloud-init, cfn-init, cfn-hup); Windows has separate folder
- **WaitCondition troubleshooting:** must return success signal within timeout; timeout/error = stack failure

#### Lab — Debugging Failed CloudFormation Stack
- Template created VPC, IGW, route table, subnet, EC2 t3.micro, web SG (ports 80 & 22), user-data (hostname + HTTPD), WaitCondition
- **DependsOn vs WaitCondition:** DependsOn = creation ORDER; WaitCondition = waits for in-instance commands to **finish and signal success**
- **The failure:** everything completes except WaitCondition → times out → CREATE_FAILED
- **The fix:** SSH to instance, read logs (sudo), found typo (HTTP vs HTTPD line 128). Delete failed stack, fix typo, re-deploy → CREATE_COMPLETE

#### Drift Detection
- **Drift** = manual out-of-band change; CFN marks resources as in-sync or modified
- **Unresolved drift blocks further updates** — always change via template, never the live resource

#### Deleting Stacks & Retaining Resources
- Deleting a stack deletes all its resources
- **Non-empty S3 bucket blocks deletion** — safety precaution
- **Options:** empty bucket first, or --retain-resources <LogicalId>

#### Knowledge Checks
- **Compute:** Amazon Lightsail (managed VPS); On-Demand vs Reserved; Windows EC2 needs AMI + instance type
- **IAM & Shared Responsibility:** AWS = OF the cloud (below hypervisor); Customer = IN the cloud (above); STS for temp credentials; use groups; enable MFA; don't use root
- **VPC:** min subnet /28, max VPC /16; NAT Gateway for private-subnet egress; NACL = optional stateless subnet control
- **Storage:** disabling S3 "block public access" does not make entire bucket public (False); EBS = persistent block storage

#### Key CLF-C02 Connections
- **Shared Responsibility Model** — guaranteed exam topic
- **IAM best practices:** groups, MFA, root hygiene, keys vs Console login, STS
- **VPC sizing:** /28 min subnet, /16 max VPC; NAT Gateway; NACL vs SG
- **CloudFormation:** rollback, --on-failure DO_NOTHING, DependsOn vs WaitCondition, drift detection

### CloudFormation Challenge, Database/Billing/Architecting KCs & 59-Question Assessment (Wed Jul 1)

#### Self-Directed CloudFormation Challenge Lab
- Build CFN template independently (VPC → subnet → IGW → route table → EC2 + user-data)
- May use LLM for specific questions (not full solution); type every line when learning
- **Validate:** upload and create stack — no failed resources = success

#### Knowledge Check — Databases
- **Session state** → DynamoDB (NoSQL, key-value, flexible schema, ms latency)
- **Non-key attribute search** → Scan (Query = key-based)
- **OLAP/analytics** → Redshift; **5x faster MySQL / 3x faster PostgreSQL** → Aurora
- **RDS features:** automated backups + point-in-time recovery = True

#### Knowledge Check — Billing & Support
- **Four plans:** Basic (no tech cases) → Developer (business-hours email) → Business (24/7, full Trusted Advisor) → Enterprise (TAM, <15-min response)
- **Trusted Advisor:** save money, improve performance, improve availability/fault tolerance, close security gaps

#### Knowledge Check — Cloud Architecting / Well-Architected
- **Performance Efficiency pillars:** Selection, Review, Monitoring, Trade-offs (NOT "Traceability")
- **ELB** routes to healthy instances; **Auto Scaling** launches/terminates by metrics
- **Multi-AZ** for availability/fault tolerance; **serverless** for performance efficiency
- **Instance metadata IP:** 169.254.169.254 (exam trap swaps digits)
- **AWS Marketplace:** find, buy, start using software solutions

#### Certification-Prep Assessment (59-Question Scenario KC)
- **CLF-C02:** 65 questions, 2h10m (~2 min/question); >=90% on practice = readiness
- **Global vs regional:** Global = IAM, CloudFront, Route 53; Regional = EC2, AMI
- **Content delivery:** CloudFront = CDN; S3 = store; Glacier = archive
- **SNS + Lambda** = real-time push notifications; **User data** runs at initialization (post-creation)
- **IAM policy types:** identity-based vs resource-based
- **DynamoDB + DAX** for high-volume reads; **VPC Peering** to connect VPCs
- **--dry-run** checks permissions; **table** = most readable CLI output

#### Spot Instances
- Up to ~90% discount; reclaimable on ~1-3 min notice
- Use only for **fault-tolerant/non-critical/interruptible** workloads

#### Key CLF-C02 Connections
- **DynamoDB** (Scan vs Query, DAX), **Aurora**, **Redshift**, **RDS**
- **Support plans** + TAM = Enterprise only; **Trusted Advisor** checks
- **Global vs regional services:** IAM/CloudFront/Route 53 (global) vs EC2/AMI (regional)
- **CloudFront** = CDN for low-latency static content; **Multi-AZ** for availability
- **Instance metadata IP** 169.254.169.254; **--dry-run** CLI feature
- **Spot vs On-Demand vs Reserved** pricing

---

## Daily Notes
- [June 29](./2026-06-29.md) — AMIs, Launch Templates, IaC, JSON vs YAML, CloudFormation Deep Dive, Lab 190
- [June 30](./2026-06-30.md) — CloudFormation Troubleshooting, Debugging Lab, Drift Detection, Stack Deletion, KCs
- [July 1](./2026-07-01.md) — CloudFormation Challenge, Database/Billing/Architecting KCs, 59-Question Assessment, Spot
