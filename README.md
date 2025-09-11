# Group22-RCPT

Research Costing and Pricing Tool (RCPT) – A web-based application by Group 22 of COMP30022 for the University of Melbourne’s RIC Office. It supports research project costing and pricing with an intuitive interface, database integration, and collaborative workflows.

© University of Melbourne. All Rights Reserved.  
Developed as part of COMP30022 (IT Project) by Group 22.  
Private repository for internal use only. Do not distribute without permission.

---

## Running Locally with Docker Compose

### 0. **Change to Docker directory from root directory**

```
cd Docker
```

### 1. **Build and start all services**

```
docker compose up --build
```

* This builds the images and starts **both frontend and backend**.
* Access the applications in your browser:

  * Backend (Spring Boot): [http://localhost:8080](http://localhost:8080)
  * Frontend (Static HTML/React app): [http://localhost:3000](http://localhost:3000)

---

### 2. **Run services individually**

* **Backend only:**

```
docker compose up --build backend
```

* **Frontend only:**

```
docker compose up --build frontend
```

* This allows you to start or rebuild a single service without affecting the other.

---

### 3. **Stop services**

* **Stop all running services:**

```
docker compose down
```

* **Stop a single service:**

 * Optionally, press Crtl+C on the terminal that is running the container. OR:

```
docker stop <service_name>
```

* **To see the service name:**
```
docker ps
```
It will be under 'NAMES'
```
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     >>NAMES<<
```

---

**Note:** All Docker and Compose files are located in the root directory and under /Docker for easy multi-service setup.

---
