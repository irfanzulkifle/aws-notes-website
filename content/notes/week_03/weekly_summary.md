# Week 3 Summary — April 13, 2026
**AWS re/Start Cohort 3: Project CloudIgnite**

---

## What We Learned

### Linux File Management

- **Linux philosophy:** Everything is a file — processes (`/proc`), hardware (`/dev`), regular files
- **File system structure:** `/`, `/home`, `/root`, `/etc`, `/var`, `/dev`, `/proc`, `/boot`, `/media`, `/mnt`
- **Vim text editor:** Insert (`i`), Command (`Esc`), Save (`:w`), Quit (`:q`), Save+Quit (`:wq`)
- **File permissions:** `rwx` (read/write/execute) for owner/group/others; numeric notation (`chmod 400`, `chmod 600`, `chmod 777`)
- **File viewing:** `ls`, `cat`, `less`, `more`, `head`, `tail` (with `-f` for live monitoring)
- **File operations:** `cp`, `mv`, `rm`, `mkdir`, `touch`, `rmdir`
- **Navigation:** `pwd`, `cd`, absolute vs relative paths
- **Search:** `find` (locate files), `grep` (search content inside files), `diff` (compare files)
- **Links:** Hard links (point to inode, survive deletion) vs Symbolic links (point to path, break on deletion)
- **Lab 233:** Practical exercises on EC2 via SSH — creating directories, files, copying/moving/deleting

### Key CLF-C02 Connection

- `chmod 400` for SSH keys on EC2 instances
- Linux permissions model maps to IAM least privilege concepts

---

## Daily Notes
- [April 13](./2026-04-13.md) — Linux File Management (Vim, permissions, commands, hard/symbolic links)
