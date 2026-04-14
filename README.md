# Institutional Data Center

A university-grade centralized data management platform built with React and Spring Boot for Vaagdevi College of Engineering, Warangal. Manages student and faculty records with role-based access control, Excel exports, and JWT authentication.

## Project Structure

```
Institutional-Data-Center/
├── frontend/            # React 19 + Vite
├── backend/             # Spring Boot 4.0.5 REST API (Java 17)
├── docker-compose.yml   # Backend + MySQL containers
└── README.md
```

## Tech Stack

### Frontend
- **React 19** with Vite
- React Router DOM 6.x
- Axios (HTTP client)
- JWT Decode (authentication)
- React Toastify (notifications)
- React Helmet Async (SEO)

### Backend
- **Spring Boot 4.0.5** (Spring Framework 7, Spring Security 7)
- Spring Data JPA + Hibernate
- MySQL 8.0
- JWT authentication (jjwt 0.12.6)
- Apache POI 5.5.1 (Excel export)
- SpringDoc OpenAPI (Swagger UI at `/swagger-ui.html`)
- Lombok

## Prerequisites

- **Node.js** 18+ and npm
- **Java 17** or later (OpenJDK or Oracle JDK)
- **Maven** 3.8+ (or use included Maven Wrapper `mvnw`)
- **MySQL** 8.0+

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example ../.env     # Edit with your DB credentials and JWT secret
./mvnw spring-boot:run
```

The API starts at [http://localhost:9000](http://localhost:9000).  
Swagger docs at [http://localhost:9000/swagger-ui.html](http://localhost:9000/swagger-ui.html).

### 2. Frontend

```bash
cd frontend
cp .env.example .env        # Edit VITE_API_BASE_URL if needed
npm install --legacy-peer-deps
npm run dev
```

Runs at [http://localhost:3000](http://localhost:3000).

### 3. Docker (alternative)

```bash
docker compose up --build
```

Starts backend + MySQL. Frontend is deployed separately (e.g., Vercel).

## Environment Variables

### Backend (`application.properties` reads from env)
| Variable | Default | Description |
|---|---|---|
| `DB_URL` | `jdbc:mysql://localhost:3306/institutional_data_center...` | MySQL JDBC URL |
| `DB_USERNAME` | `root` | Database username |
| `DB_PASSWORD` | `Admin@123` | Database password |
| `JWT_SECRET` | (built-in) | Base64-encoded 512-bit key |
| `JWT_EXPIRATION` | `3600` | Token TTL in seconds |
| `CORS_ORIGINS` | `http://localhost:3000,...` | Comma-separated allowed origins |

### Frontend (`.env`)
| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://127.0.0.1:9000` | Backend API URL |

## Build for Production

```bash
# Frontend
cd frontend && npm run build    # Output in frontend/build/

# Backend
cd backend && ./mvnw package -DskipTests   # Output: backend/target/*.jar
java -jar backend/target/*.jar
```
