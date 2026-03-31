# Remote Server Snapshot (Jan 23, 2026)

## System Overview
- **Host:** `82.112.253.29`
- **Identity:** `deploy`
- **Environment:** Dockerized Architecture (restructured from PM2)

## Docker Services & Port Mapping

| Service Name | Container Name | Internal Port | External Visibility |
|--------------|----------------|---------------|---------------------|
| `report-system` | `report-system` | 3001 | Proxied (reports.laapak.com) |
| `laapak-po` | `laapak-po` | 3002 | Proxied (po.laapak.com) |
| `fz-system` | `fz-system` | 4000 | Proxied (system.fixzzone.com/api) |
| `fz-frontend` | `fz-frontend` | 80 | Proxied (system.fixzzone.com) |
| `inventory-system` | `inventory-system` | 4005 | Proxied (TBD) |
| `nginx-proxy` | `nginx-proxy` | 80 / 443 | Entry Point |
| `mysql-db` | `mysql-db` | 3306 | Entry Point (Secured) |

## Infrastructure Components
| Service | Details |
|---------|---------|
| **Docker Compose** | Entry: `/home/deploy/docker-infra/docker-compose.yml` |
| **Nginx (Docker)** | Configs: `/home/deploy/docker-infra/nginx/conf.d/` |
| **SSL** | Managed via host `/etc/letsencrypt` mapped to proxy container. |
| **Database** | MySQL 8.0 Container with persistent volume `mysql_data`. |
| **Automation** | n8n (Port 5678, currently remains in `/home/deploy/n8n_data`) |

## Project Root Layout (`/home/deploy`)
- `docker-infra/` - **NEW** Central management for all containers and proxy configs.
- `inventory-system/` - Containerized.
- `laapak-projects/` (reports & laapak-po) - Containerized.
- `fz-projects/` - Containerized.
- `db_backup_*.sql` - Historical and ongoing SQL dumps.

## Maintenance Notes
- **Logs:** Use `docker compose logs -f <service>` in `/home/deploy/docker-infra`.
- **Restarts:** Use `docker compose restart <service>`.
- **PM2/Host-Nginx:** Both services have been **DISABLED** to avoid port conflicts.
