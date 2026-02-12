# Project Overview

This is a full-stack product data and analytics platform.

The system collects, processes, and exposes product-related data from multiple sources such as:
- Shopify API
- Public APIs
- Web crawling (HTML parsing, API scraping)
- Future external commerce platforms

The application will provide:
- Product data aggregation
- Statistical analysis
- Dashboard visualization
- REST APIs for frontend consumption
- Scalable architecture for future data expansion

---

# Tech Stack

Frontend:
- React
- Vite
- TypeScript
- Tailwind CSS
- Clean component-based architecture

Backend:
- Spring Boot (Java 17)
- Gradle
- REST API architecture
- Layered structure (controller / service / repository / domain / dto)

Infrastructure (planned):
- Docker-ready
- Docker Compose
- Kubernetes-ready structure
- Environment-based configuration

---

# Backend Architecture Rules

- Follow clean layered architecture:
  - controller
  - service
  - repository
  - domain (entity)
  - dto
- Never return entities directly from controller
- Always use DTO for API responses
- Separate crawling logic into a dedicated service layer
- External API integration must be isolated (e.g., shopify package)

Example package structure:

com.projectname
 ├── controller
 ├── service
 ├── repository
 ├── domain
 ├── dto
 ├── integration
 │     ├── shopify
 │     └── crawler
 └── config

---

# Crawling Strategy

1. Prefer official APIs (e.g., Shopify API) over scraping.
2. If crawling is required:
   - Use Jsoup for static HTML parsing.
   - Avoid Selenium unless absolutely necessary.
3. If the target site uses JavaScript:
   - Inspect network calls and use API endpoints directly.
4. Implement retry and error handling for external requests.
5. Crawling logic must not block main request thread (use async when needed).

---

# Data Design Principles

- Product is the core domain.
- Statistics are derived data.
- Keep raw data and processed data separated.
- Design for future data expansion.

Example core entity ideas:
- Product
- ProductPriceHistory
- ProductStatistics
- ExternalSourceLog

---

# Frontend Architecture Rules

- Use reusable components.
- Separate layout and page logic.
- Keep UI state and API logic separated.
- Prepare for dashboard-style expansion.

Folder structure example:

src/
 ├── components/
 ├── layouts/
 ├── pages/
 ├── services/ (API calls)
 ├── hooks/
 └── types/

---

# API Design Guidelines

- Base path: /api
- Use REST conventions
- Standard response format:

{
  "success": true,
  "data": {},
  "error": null
}

- All external integrations should be abstracted.

---

# Future Goals

- Dockerization
- CI/CD integration
- Kubernetes deployment
- Caching layer (Redis)
- Batch crawling scheduler
- Authentication & Role-based access
- Data visualization enhancements

---

# Development Philosophy

- Clean architecture first
- Scalable design
- No tight coupling between frontend and backend
- Infrastructure-ready code from the beginning
- Think production-ready, even in development stage