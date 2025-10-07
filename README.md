
```markdown
# 🚀 Prometheus + Grafana Monitoring Setup for Express + TypeScript + PostgreSQL App

This project demonstrates how to integrate **Prometheus** and **Grafana** monitoring into a simple **Express + TypeScript + TypeORM (PostgreSQL)** backend — a common setup in fintech and integration engineering environments.

It exposes a `/metrics` endpoint that provides application and performance metrics (request count, response time, DB query count), which Prometheus scrapes and Grafana visualizes.

---

## 🧠 Tech Stack
- **Node.js / Express**
- **TypeScript**
- **TypeORM (PostgreSQL)**
- **Prometheus** (metrics collection)
- **Grafana** (metrics visualization)
- **Docker Compose**

---

## 📁 Project Structure
```

prometheus-demo/
├── src/
│   ├── app.ts                # Express app entry point
│   ├── datasource.ts         # TypeORM PostgreSQL setup
│   ├── entity/
│   │   └── User.ts           # Simple User entity
│   ├── routes/
│   │   └── user.ts           # User routes with metrics tracking
│   └── metrics.ts            # Prometheus custom metrics setup
├── .env
├── docker-compose.yml        # Runs Prometheus + Grafana
├── prometheus.yml            # Prometheus configuration file
├── package.json
└── tsconfig.json

````

---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/<your-username>/prometheus-monitoring-demo.git
cd prometheus-monitoring-demo
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment

Create a `.env` file:

```env
PORT=4000
DB_HOST=localhost
DB_USER=postgres
DB_PASS=postgres
DB_NAME=demo_db
```

---

## 🧩 Running the Application

### 🟢 Start the Express Server

```bash
npx ts-node-dev src/app.ts
```

The server runs at:
👉 `http://localhost:4000`

Endpoints:

* `GET /users` → fetch users from DB
* `GET /metrics` → exposes Prometheus metrics

---

## 🐳 Running Prometheus & Grafana via Docker

### 1️⃣ Start Services

```bash
docker-compose up -d
```

This launches:

* **Prometheus** → [http://localhost:9090](http://localhost:9090)
* **Grafana** → [http://localhost:3000](http://localhost:3000)

### 2️⃣ Prometheus Configuration (`prometheus.yml`)

```yaml
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'express-app'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['host.docker.internal:4000']
```

> If using Linux, replace `host.docker.internal` with your machine IP (e.g., `192.168.x.x:4000`).

---

## 📊 Setting Up Grafana

1. Visit **[http://localhost:3000](http://localhost:3000)**
   Default credentials:

   * **Username:** `admin`
   * **Password:** `admin`

2. **Add Prometheus as Data Source**

   * Go to ⚙️ → *Data Sources* → *Add new data source*
   * Select **Prometheus**
   * Set URL to: `http://prometheus:9090`
   * Click **Save & Test**

3. **Create Dashboard**

   * Go to ➕ → *Dashboard* → *Add New Panel*
   * Example Queries:

     * Request count:

       ```
       rate(http_request_duration_seconds_count[1m])
       ```
     * Request latency (p90):

       ```
       histogram_quantile(0.9, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
       ```

---

## 📈 Example Metrics Collected

| Metric Name                      | Description                     |
| -------------------------------- | ------------------------------- |
| `http_request_duration_seconds`  | Request duration histogram      |
| `db_query_total`                 | Total database queries executed |
| `db_query_duration_seconds`      | Duration of db queries in secs  |
| `num_of_users`                   | Number of users in the system   |
| `process_cpu_user_seconds_total` | Default system CPU usage        |
| `process_resident_memory_bytes`  | Memory usage                    |

---

## 🧠 How It Works

1. **Express App** exposes `/metrics` using the `prom-client` library.
2. **Prometheus** scrapes these metrics every few seconds.
3. **Grafana** visualizes metrics using Prometheus as its data source.
4. You can monitor:

   * API latency and throughput
   * Database query success rates
   * Memory and CPU usage
   * Application uptime

---
---

## 🐳 Quick Docker Setup

If you want to run **Prometheus** and **Grafana** for this app using Docker, use the configuration below.

### 📦 docker-compose.yml
```yaml
version: "3.8"
services:
  prometheus:
    image: prom/prometheus
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    container_name: grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  prometheus_data:
  grafana_data:

⚙️ prometheus.yml
global:
  scrape_interval: 5s  # how often Prometheus collects data

scrape_configs:
  - job_name: 'express-app'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['host.docker.internal:4000']

💡 Linux users: Replace host.docker.internal with your local machine IP, e.g., 192.168.x.x:4000._

🚀 Run the Stack
docker-compose up -d


Prometheus → http://localhost:9090

Grafana → http://localhost:3000

✅ Verify Everything Works

Visit Prometheus targets:
👉 http://localhost:9090/targets

You should see:

express-app | UP | last scrape: few seconds ago


Then visit Grafana and connect to Prometheus:

Data source URL: http://prometheus:9090

Create a dashboard and start visualizing metrics!

📊 Example Queries

Request rate:

rate(http_request_duration_seconds_count[1m])


Latency (p90):

histogram_quantile(0.9, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))


Database query count:

sum(db_query_total)


Once you run this setup, you’ll have a live observability stack — your local Express/TypeScript API sending metrics → Prometheus collecting them → Grafana visualizing them in real time. 🎯
## 🔐 Example Dashboard Metrics

![Grafana Example](https://grafana.com/static/img/docs/grafana/cloud/grafana-dashboard-hero.jpg)

---

## 🧭 Why It Matters (Fintech / Integration Context)

In financial or integration systems like **Gapstack**, observability ensures:

* High uptime and reliability,
* Early detection of integration/API failures,
* Clear traceability of transaction behavior,
* Compliance readiness for audits.

This setup is production-ready and easily extends to **NestJS**, **microservices**, or **Kubernetes** deployments.

---

## 💬 Example Explanation (Interview-Style)

> “I implemented Prometheus + Grafana monitoring in a TypeScript backend to track API performance and database health.
> Prometheus scrapes metrics from my `/metrics` endpoint every 5 seconds, while Grafana visualizes request latency and throughput.
> This ensures full observability and traceability — crucial for fintech systems that rely on reliable integrations and uptime.”

---

## 🧾 License

MIT License © 2025 [Faruq Hameed]

---

### ✨ Author

**Faruq Hameed**
Fullstack Developer (Backend + Mobile)
[LinkedIn](https://linkedin.com/in/yourprofile) | [GitHub](https://github.com/Faruq-Hameed)

---

```

---
```
