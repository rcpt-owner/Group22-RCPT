## 🧱 Backend Documentation
The backend provides REST APIs for managing projects, cost items, approvals, and lookups. It’s built with Spring Boot (Java 17) and integrates MongoDB (main data) + PostgreSQL (lookups), authenticated through Firebase.

## ⚙️ Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Framework** | Spring Boot | REST API framework |
| **Language** | Java 17 | Core programming language |
| **Database** | MongoDB | Stores main project and cost data |
| **Lookup DB** | PostgreSQL | Stores reference data (salary rates, multipliers) |
| **Authentication** | Firebase | Handles user authentication and access roles |
| **Build Tool** | Maven | Dependency and build management |
| **Testing** | JUnit 5 | Unit and integration testing |
| **Mapping** | MapStruct | DTO ↔ domain mapping |
| **Containerisation** | Docker & Docker Compose | Local orchestration and deployment |
| **CI/CD** | GitHub Actions | Automated build, test, and deployment pipeline |

---

## 🧩 Architecture Overview

```
Frontend (React + Netlify)
↓  HTTPS / JSON API
Backend (Spring Boot)
↓
Databases (MongoDB + PostgreSQL)
```
**Core Modules**
- `ProjectController` – CRUD operations for projects  
- `ApprovalController` – Handles submission and approval stages  
- `FirebaseUserService` – Validates Firebase tokens and manages roles  

---

## 🔗 Key API Endpoints

| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/v1/projects` | `GET` | Retrieve all projects for the logged-in user |
| `/api/v1/projects/{id}` | `GET` | Retrieve a specific project by ID |
| `/api/v1/projects` | `POST` | Create a new project |
| `/api/v1/projects/{id}` | `PUT` | Update an existing project |
| `/api/v1/projects/{id}` | `DELETE` | Delete a project |
| `/api/v1/projects/{id}/approvals/submit` | `POST` | Submit project for approval |
| `/api/v1/projects/{id}/approvals/approve` | `POST` | Approve or reject a project |
| `/api/v1/lookup` | `GET` | Retrieve salary rates, multipliers, and reference tables |
| `/api/v1/export/pdf/{id}` | `GET` | Export project summary as a PDF document |

> All endpoints require an `Authorization` header containing a valid Firebase JWT.

---

## 🧮 Data Flow

1. **Authentication**
   - The frontend signs in via Firebase.
   - The Firebase UID or JWT token is passed in each backend request header.

2. **Project Management**
   - Frontend submits project JSON data via REST.
   - Backend maps DTOs → domain models using MapStruct.

3. **Cost Calculation**
   - `PriceSummary` is generated dynamically per project.

5. **Persistence**
   - Project data is stored in MongoDB as a nested JSON document.
   - Lookup data (salary rates, multipliers) is fetched from PostgreSQL.

6. **Approval Workflow**
   - Approvers change the project’s `status` field and add `ApprovalEntry` logs.
   - Updates trigger changes to the `ApprovalTracker`.

---

## 🧱 Domain Model Summary

### Core Entities

| **Entity** | **Purpose** |
|-------------|-------------|
| **Project** | Aggregate root representing a complete research costing instance. |
| **ProjectDetails** | Administrative metadata such as faculty, funder, and project duration. |
| **StaffCost** | Represents salary-related costs for project staff. |
| **NonStaffCost** | Represents non-salary costs (equipment, consumables, services). |
| **PriceSummary** | Stores computed totals and final price-to-charge values. |
| **ApprovalTracker** | Manages project approval stages and current workflow status. |
| **ApprovalEntry** | Records comments or decisions during approval stages. |
| **User** | Represents a system user (admin, approver, or researcher). |

See the full Domain UML Diagram for visual relationships below.
<img width="803" height="700" alt="Domain UML Diagram" src="https://github.com/user-attachments/assets/0e0c38f8-9c4f-4cd9-819c-b6b569f30c64" />

---

## 🧰 Running Locally with Docker Compose

```
bash
docker compose up --build backend
```
**Default Ports**
* Backend → http://localhost:8080
* MongoDB → 27017
* PostgreSQL → 5432

## ⚙️ Environment Variables

The backend requires a `.env` file to configure runtime settings for local or Docker Compose execution.

| **Variable** | **Description** |
|---------------|-----------------|
| `SPRING_PROFILES_ACTIVE` | Defines the Spring Boot runtime profile. Use `dev` for local development or `prod` for deployment. |  
| `MONGO_URI` | Connection URI for the MongoDB instance storing project data. |  
| `POSTGRES_URL` | JDBC connection string for the PostgreSQL lookup database. |  
| `POSTGRES_USER` | Username for PostgreSQL access. | `rcpt_admin` |
| `POSTGRES_PASSWORD` | Password for the PostgreSQL user. | `secret` |
| `FIREBASE_API_KEY` | API key for Firebase Admin SDK to enable user authentication. |  
| `PORT` | The port on which the backend runs (default is `8080`). |  

**Example `.env` file**

```
env
SPRING_PROFILES_ACTIVE=dev
MONGO_URI=mongodb://mongo:27017/rcpt
POSTGRES_URL=jdbc:postgresql://postgres:5432/lookup
POSTGRES_USER=rcpt_admin
POSTGRES_PASSWORD=secret
FIREBASE_API_KEY=your_firebase_api_key
PORT=8080
```

## 🧪 **Testing**

Run all backend tests using Maven:
```
mvn test
```
or through local API calls, see below for an example walkthrough:
https://teamtwentytwo.atlassian.net/wiki/spaces/GTTP/pages/87392257/Local+MongoDB+Testing

**Links and References**
* Repo root README: [../README.md](https://github.com/rcpt-owner/Group22-RCPT/blob/refactor/repo-documentation-fix/README.md)
* Docker README: [Docker/README.md](https://github.com/rcpt-owner/Group22-RCPT/blob/refactor/repo-documentation-fix/Docker/README.md)

| **File / Directory** | **Purpose** |
|------------------------|-------------|
| [`src/main/java/com/itproject/rcpt/RcptApplication.java`](./src/main/java/com/itproject/rcpt/Application.java) | Main Spring Boot entry point — starts the backend server. |
| [`src/main/java/com/itproject/rcpt/controllers/ProjectController.java`](./src/main/java/com/itproject/rcpt/controllers/ProjectController.java) | Defines endpoints for project creation, updates, and retrieval. |
| [`src/main/java/com/itproject/rcpt/controllers/ApprovalController.java`](./src/main/java/com/itproject/rcpt/controllers/ApprovalController.java) | Handles project submission and approval actions. |
| [`src/main/java/com/itproject/rcpt/domain/value/Project.java`](./src/main/java/com/itproject/rcpt/domain/value/Project.java) | Main domain model aggregating all cost and approval data. |
| [`src/main/java/com/itproject/rcpt/domain/value/StaffCost.java`](./src/main/java/com/itproject/rcpt/domain/value/StaffCost.java) | Represents staff-related cost entries and their attributes. |
| [`src/main/java/com/itproject/rcpt/domain/value/NonStaffCost.java`](./src/main/java/com/itproject/rcpt/domain/value/NonStaffCost.java) | Represents non-salary costs (e.g., equipment, consumables). |
| [`src/main/java/com/itproject/rcpt/domain/value/PriceSummary.java`](./src/main/java/com/itproject/rcpt/domain/value/PriceSummary.java) | Holds calculated total cost and price values. |
| [`src/main/resources/application.yml`](./src/main/resources/application.yml) | Main configuration file for database connections and environment setup. |
| [`pom.xml`](./pom.xml) | Maven configuration for dependencies, build, and test plugins. |

---

**Recommended starting point for new developers:**
1. **`Project.java`** – Understand how a project is structured and related entities are embedded.  
2. **`ProjectController.java`** – See how the API exposes project data.  
3. **`application.yml`** – Verify connection strings and environment profiles.

Last updated 2025-10-29

Changelog

v0.1 — Initial Backend README (placeholder for future updates)
