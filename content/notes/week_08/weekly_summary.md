# Week 8 Summary — May 18–24, 2026
**AWS re/Start Cohort 3: Project CloudIgnite**

---

## What We Learned

### Python Modules & File Handling (Mon May 18)
- **Code organization:** Functions → Modules → Libraries; `import module` or `from module import function`
- **File handling:** `open()` with modes `"r"`, `"w"`, `"a"`; always `close()` or use `with open()`
- **JSON module:** `json.dumps()` (Python→JSON), `json.loads()` (JSON→Python), `json.dump()/load()` for files
- **OS module:** `os.system()`, `os.listdir()`, `os.mkdir()`, `os.getcwd()`
- **PIP:** Package manager; `pip install`, `pip list`
- **GitHub & Git Lab:** `clone`, `add`, `commit`, `push`, `pull`, branches, merge, Personal Access Token

### Bioinformatics & SysAdmin Python (Tue–Wed May 19–20)
- **Lab 118:** Reading insulin sequence from NCBI; cleaning text files; string slicing
- **Lab 120:** Counting amino acid occurrences (`.count()`); molecular weight calculation
- **Lab 122:** Net charge calculation using PKa values and Henderson-Hasselbalch formula
- **SysAdmin with Python:** `os.system()` (deprecated) vs `subprocess.run()` (preferred)
- **Command-line arguments:** `sys.argv[1]` for script arguments
- **VS Code debugging:** Breakpoints, Watch panel for variable inspection

### Debugging & Testing (Thu May 21)
- **Error types:** Syntax (easy), Runtime (medium — read traceback), Logical (hard — no crash)
- **Debugging tools:** `pdb` command-line debugger, VS Code debugger with breakpoints and watchers
- **Testing levels:** Unit → Integration → System → Acceptance (UAT)
- **Code quality:** SOLID, DRY, KISS principles
- **Lab 130:** Debugging Caesar Cipher — Type error, logic error, wrong parameter passed

### DevOps & CI/CD (Thu–Fri May 21–22)
- **DevOps:** CALMS framework; uniting development and operations
- **Methodologies:** Waterfall (sequential) vs Agile (sprint-based iterations)
- **CI/CD:** Continuous Integration (auto-test on push) → Continuous Delivery/Deployment
- **Pipeline:** Push → GitHub Action → Tests → Build → Deploy to EC2 → Restart
- **IaC:** Infrastructure as Code (Terraform) — define infrastructure as code
- **Automation vs Orchestration:** Single task vs coordinating multiple tasks
- **Microservices:** Independent services (Netflix example) vs monolithic
- **CI/CD tools:** Jenkins, GitHub Actions, GitLab CI/CD, AWS CodeDeploy
- **PyLint/PyTest:** Code style checking and unit testing frameworks
- **Semantic versioning:** MAJOR.MINOR.PATCH

### Python Practice (Sat May 24)
- **Algorithms:** Prime numbers (O(n/2), skip evens, check up to √n)
- **Palindrome checker:** Clean string → reverse with `[::-1]` → compare
- **LeetCode Two Sum:** Nested loop approach (O(n²))
- **Nested loops:** Right-angled triangle and pyramid pattern printing
- **Python tips:** Ternary operator, `map()`, `zip()`, multiple assignment, list slicing, type hints

### Key CLF-C02 Connections
- AWS Lambda, Cloud9, EC2, CodeCommit, CodeBuild, CodeDeploy, CodePipeline, CloudFormation
- DevOps culture, CI/CD pipelines, IaC, microservices (ECS, EKS, Lambda)

---

## Daily Notes
- [May 18](./2026-05-18.md) — Python Modules, File Handlers, JSON, PIP, GitHub & Git Basics
- [May 19](./2026-05-19.md) — Bioinformatics Labs (Insulin Analysis), String Handling, Dictionaries
- [May 20](./2026-05-20.md) — SysAdmin with Python, subprocess, VS Code Debugging
- [May 21](./2026-05-21.md) — Debugging & Testing, Caesar Cipher Debug Lab, DevOps & CI/CD
- [May 22](./2026-05-22.md) — Automation vs Orchestration, Microservices, PyLint/PyTest, Version Control
- [May 24](./2026-05-24.md) — Prime Numbers, Palindrome, LeetCode, Nested Loops, Python Tips