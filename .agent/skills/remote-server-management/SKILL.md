---
name: managing-remote-servers
description: Specialized skill for managing and performing actions on the remote VPS (82.112.253.29). Use when the user mentions "vps", "remote server", "deploy", or needs to run commands on the server.
---

# Remote Server Management

Tools and workflows for managing the Laapak VPS.

## Server Information

- **Host:** `82.112.253.29`
- **User:** `deploy`
- **Identity:** Use password `0000`
- **Structure Snapshot:** 👉 **[`resources/server-snapshot.md`](resources/server-snapshot.md)**

## When to Use
- User wants to check server status (Docker containers)
- User needs to deploy new code (Git + Docker Build)
- User wants to run database migrations on production (Inside Docker)
- User needs to check remote logs (Docker logs)

## Workflow: Deployment & File Transfer

**PRIMARY METHOD: GitHub**
Always prefer using Git to move code to the server. This ensures version control and consistency.

```markdown
- [ ] Push local changes to GitHub
- [ ] SSH into server
- [ ] Navigate to project directory (e.g., `/home/deploy/laapak-projects/laapak-po`)
- [ ] Run `git pull`
- [ ] Navigate to `/home/deploy/docker-infra`
- [ ] Run `docker compose up -d --build [service_name]`
```

**SECONDARY METHOD: Direct Transfer**
Use `scp` or `rsync` *only* for:
- `.env` files or secrets not in repo
- Temporary one-off files
- Debugging assets

## Common Commands

### 1. Docker-Based Deployment (Recommended)
```bash
# 1. Local: Push changes
git push origin main

# 2. Remote: Pull & Rebuild Service
ssh vps "cd /home/deploy/laapak-projects/laapak-po && git pull && cd /home/deploy/docker-infra && docker compose up -d --build laapak-po"
```

### 2. Server Maintenance
```bash
# Check all container status
docker ps

# Check logs for a specific service
docker compose logs -f [service_name]

# Restart the entire stack
docker compose restart

# Check system resources
htop
df -h

### 3. Public Ports (Direct IP Access)
- **Inventory System:** `http://82.112.253.29:4005`
- **Evolution API (WhatsApp):** `http://82.112.253.29:8080` (Manager: `/manager`)
- **Fix Zone Backend:** Internal (Port 4000)
- **PO & Reports:** Proxied via SSL
```

### 3. Direct File Transfer (Fallback)
```bash
# Upload .env or config files
scp .env.production vps:/home/deploy/inventory-system/.env
```

## Security & Best Practices

- **Password Prompt:** I will prompt for the password (`0000`) if needed.
- **Root Password:** The MySQL root password is `0000`.
- **Infrastructure Path:** All Docker orchestration files are in `/home/deploy/docker-infra`.
- **Prisma Migrations:** Run migrations inside the container: `docker exec -it laapak-po npx prisma migrate deploy`.
