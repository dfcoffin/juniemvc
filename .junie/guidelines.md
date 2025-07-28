# Junie MVC Developer Guidelines

## Project Overview
Junie MVC is a Spring Boot application that provides a RESTful API for managing beer data. The application follows standard Spring Boot architecture patterns with a layered approach.

## Tech Stack
- Java 21
- Spring Boot 3.5.4
- Spring Data JPA
- Flyway for database migrations
- H2 in-memory database
- Lombok for reducing boilerplate code
- MapStruct for object mapping
- JUnit 5 and Mockito for testing

## Project Structure
The project follows a standard Spring Boot structure:

```
src/
├── main/
│   ├── java/guru/springframework/juniemvc/
│   │   ├── controllers/     # REST controllers
│   │   ├── entities/        # JPA entities
│   │   ├── repositories/    # Spring Data JPA repositories
│   │   ├── service/         # Business logic layer
│   │   └── JuniemvcApplication.java  # Application entry point
│   └── resources/
│       ├── db/migration/    # Flyway migration scripts
│       └── application.properties  # Application configuration
└── test/
    └── java/guru/springframework/juniemvc/
        ├── controllers/     # Controller tests
        ├── repositories/    # Repository tests
        └── service/         # Service tests
```

## Architecture
The application follows a layered architecture:
1. **Controller Layer** - Handles HTTP requests and responses
2. **Service Layer** - Contains business logic
3. **Repository Layer** - Manages data access
4. **Entity Layer** - Defines the data model

## Running the Application
To run the application:
```
./mvnw spring-boot:run
```

## Running Tests
To run all tests:
```
./mvnw test
```

To run specific test classes:
```
./mvnw test -Dtest=BeerControllerTest
```

## Database
- The application uses an H2 in-memory database by default
- Database schema is managed through Flyway migrations
- Migration scripts are located in `src/main/resources/db/migration`

## Best Practices
1. **Code Organization**
   - Follow the layered architecture pattern
   - Keep controllers thin, with business logic in services
   - Use interfaces for services to allow for different implementations

2. **Testing**
   - Write tests for all layers (controllers, services, repositories)
   - Use @DataJpaTest for repository tests
   - Use MockMvc for controller tests
   - Use Mockito for service tests
   - Follow the Given-When-Then pattern for test structure

3. **API Design**
   - Use appropriate HTTP methods (GET, POST, PUT, DELETE)
   - Return appropriate HTTP status codes
   - Document APIs with clear comments

4. **Error Handling**
   - Use proper exception handling
   - Return meaningful error messages

5. **Database**
   - Use Flyway migrations for database schema changes
   - Follow naming conventions for database objects

## Common Tasks
1. **Adding a new entity**
   - Create a new entity class in the entities package
   - Create a repository interface in the repositories package
   - Create a service interface and implementation
   - Create a controller for the entity
   - Add Flyway migration script for the new table
   - Write tests for all components

2. **Modifying an existing entity**
   - Update the entity class
   - Add a new Flyway migration script for schema changes
   - Update affected services and controllers
   - Update tests

3. **Adding a new endpoint**
   - Add a new method to the appropriate controller
   - Implement required service methods
   - Write tests for the new endpoint