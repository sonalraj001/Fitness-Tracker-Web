# Fitness Monolith

A Spring Boot backend project for fitness tracking and activity management using MySQL and REST APIs.

## Tech Stack
- Java
- Spring Boot
- Spring Data JPA
- MySQL
- Swagger UI

## Features
- User Authentication
- REST APIs
- MySQL Database Integration
- Swagger API Documentation
- Layered Backend Architecture

## Database Configuration

Update your `application.properties` file:

```properties
spring.application.name=fitness-monolith

# Database configuration
spring.datasource.url=jdbc:mysql://localhost:3306/fitness
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

## Run the Project

1. Clone the repository

```bash
git clone YOUR_REPO_URL
```

2. Create MySQL database

```sql
CREATE DATABASE fitness;
```

3. Open the project in IntelliJ IDEA or VS Code

4. Run the Spring Boot application

## Swagger Documentation

Open in browser:

```text
http://localhost:8080/swagger-ui/index.html
```

## Author

Sonal Raj
