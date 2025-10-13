# Docker — running the project locally

This document explains how to build and run the frontend (React) and backend (Spring Boot) using Docker Compose.

This repository uses **Docker** to containerise the frontend (React) and backend (Spring Boot) applications. The Docker setup allows contributors to run the full environment locally without installing all dependencies manually.

* **Frontend**: React application
* **Backend**: Spring Boot application

## Prerequisites
- Docker and Docker Compose (v2+) installed.
- Be in the /Docker directory 

## Quick start (from repository root)
1. Build and start both services:

   ```bash
   docker compose up --build
   ```

2. Open in your browser:
- Frontend: http://localhost:3000
- Backend:  http://localhost:8080

## Run a single service
- Backend only:

  ```bash
  docker compose up --build backend
  ```

- Frontend only:

  ```bash
  docker compose up --build frontend
  ```

## Stop and clean up
- Stop all services:

  ```bash
  docker compose down
  ```

- Stop a single running container (from another terminal):
  - Optionally, press Crtl+C on the terminal that is running the container. 
  
  OR:


  ```bash
  docker stop <container_name>
  ```

- To see the container name:
  ```
  docker ps
  ```
  It will be under 'NAMES'
  ```
  CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     >>NAMES<<
  ```

## Notes about repository layout
- `docker-compose.yml` is located at the repository root.  
- Dockerfiles are centralized in `/Docker/`:
  - `Docker/backend.Dockerfile`  (builds the Spring Boot app)
  - `Docker/frontend.Dockerfile` (builds/runs the React app)

## Build contexts
- The compose file builds each service with its project directory as the build context (`./Backend` and `./Frontend`) and points to the centralized Dockerfiles in `/Docker`.

## Updating Dependencies

If you add new dependencies:

### Frontend (React)

1. Install the dependency locally:

```bash
npm install <package-name>
```

2. Update `package.json` (already done by `npm install`).
3. Rebuild the Docker image to include the new dependency:

```bash
docker compose up --build
```

### Backend (Spring Boot / Maven)

1. Add the dependency in `pom.xml`.
2. Rebuild the Docker image:

```bash
docker compose up --build
```

> **Tip:** Docker caching may reuse old layers. Use `--no-cache` if a new dependency isn’t showing up:

```bash
docker compose build --no-cache
```

## Common issues & troubleshooting
- "Failed to configure a DataSource": the project may try to connect to a database. For local testing the backend has been configured to skip DataSource autoconfiguration if no DB is provided. If you need a DB, add a database service (Postgres/MySQL) to `docker-compose.yml` and set the correct `spring.datasource.*` properties.

- "failed to calculate checksum ... /.mvn: not found": ensure the Maven wrapper files (.mvn and mvnw) are included in the Backend build context (they must not be excluded by .dockerignore).

- Compose warning about `version` being deprecated: remove the `version:` top-level key from `docker-compose.yml` (current compose v2 uses the services: key only).

## Rebuilding tips
- If dependencies change, rebuild with no cache to avoid stale layers:

  ```bash
  docker compose build --no-cache
  ```

- To view logs and follow output:

  ```bash
  docker compose logs -f
  ```

## Developer notes
- Keep Dockerfiles in `/Docker` for consistency. If you change a Dockerfile or ports, update this README and `docker-compose.yml`.
- Use .dockerignore files in Backend and Frontend to keep build contexts small. Do not exclude the Maven wrapper from the backend context.

## Common Commands

| Command                               | Purpose                           |
| ------------------------------------- | --------------------------------- |
| `docker compose up --build`           | Build images and start containers |
| `docker compose down`                 | Stop and remove containers        |
| `docker compose logs -f`              | Follow logs for all services      |
| `docker exec -it <container> /bin/sh` | Open shell in a container         |
| `docker compose build --no-cache`     | Force rebuild without cache       |
