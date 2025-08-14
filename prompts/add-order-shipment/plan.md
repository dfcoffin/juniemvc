# Implementation Plan: Beer Order Shipment

This document outlines the implementation plan for adding the Beer Order Shipment entity and related components to the Beer API.

## 1. Create the BeerOrderShipment Entity

- Create a new JPA entity class `BeerOrderShipment` in the package `guru.springframework.juniemvc.entities`
- Extend the `BaseEntity` class to inherit common fields (id, version, createDate, updateDate)
- Add the required fields:
  - `shipmentDate` (LocalDateTime): The date and time when the shipment was created (not null)
  - `carrier` (String): The name of the carrier responsible for the shipment
  - `trackingNumber` (String): The tracking number provided by the carrier
- Add a ManyToOne relationship with the `BeerOrder` entity with a JoinColumn named "beer_order_id"
- Use Lombok annotations for getter/setter methods, constructors, and builder pattern
- Add appropriate JPA annotations for the entity and its fields

## 2. Update the BeerOrder Entity

- Add a OneToMany relationship field for BeerOrderShipments with cascade and orphan removal
- Add helper methods for adding and removing shipments, similar to the existing methods for BeerOrderLines:
  - `addBeerOrderShipment(BeerOrderShipment shipment)`
  - `removeBeerOrderShipment(BeerOrderShipment shipment)`

## 3. Create Flyway Migration Script

- Create a new migration script in `src/main/resources/db/migration` named `V3__add_beer_order_shipment_table.sql`
- Create the `beer_order_shipment` table with the necessary columns:
  - `id` (INT, primary key, auto-increment)
  - `version` (INT)
  - `created_date` (TIMESTAMP)
  - `update_date` (TIMESTAMP)
  - `shipment_date` (TIMESTAMP, not null)
  - `carrier` (VARCHAR)
  - `tracking_number` (VARCHAR)
  - `beer_order_id` (INT)
- Add a foreign key constraint to establish the relationship with the `BeerOrder` entity
- Follow the pattern used in previous migration scripts, adding the column first and then the constraint

## 4. Create the BeerOrderShipmentDto

- Create a DTO class `BeerOrderShipmentDto` in the package `guru.springframework.juniemvc.models`
- Extend the `BaseEntityDto` class
- Include the same fields as the entity: `shipmentDate`, `carrier`, `trackingNumber`
- Add validation annotations:
  - `@NotNull` for required fields (shipmentDate)
  - Other appropriate validations based on field types
- Use Lombok annotations for getter/setter methods, constructors, and builder pattern
- Use `@SuperBuilder` to ensure builder works with inheritance from BaseEntityDto

## 5. Update BeerOrderDto

- Add a field for shipments: `Set<BeerOrderShipmentDto> beerOrderShipments`
- Add validation annotation if needed
- Update the constructors and builder pattern to include the new field

## 6. Create BeerOrderShipmentMapper Interface

- Create a mapper interface `BeerOrderShipmentMapper` in the package `guru.springframework.juniemvc.mappers`
- Annotate with `@Mapper` using the Spring component model
- Define methods for entity-to-DTO and DTO-to-entity conversion:
  - `BeerOrderShipmentDto beerOrderShipmentToBeerOrderShipmentDto(BeerOrderShipment beerOrderShipment)`
  - `BeerOrderShipment beerOrderShipmentDtoToBeerOrderShipment(BeerOrderShipmentDto beerOrderShipmentDto)`
- Define an update method:
  - `void updateBeerOrderShipmentFromDto(BeerOrderShipmentDto dto, @MappingTarget BeerOrderShipment entity)`

## 7. Update BeerOrderMapper

- Add the BeerOrderShipmentMapper to the `uses` attribute in the @Mapper annotation
- Update the mapping methods to include the new shipments field
- Add a helper method for adding shipments to a BeerOrder, similar to the existing method for adding lines

## 8. Create BeerOrderShipmentRepository

- Create a repository interface `BeerOrderShipmentRepository` in the package `guru.springframework.juniemvc.repositories`
- Extend `JpaRepository<BeerOrderShipment, Integer>`
- Add custom query methods if needed (e.g., finding shipments by carrier or tracking number)
- Annotate with `@Repository`

## 9. Create BeerOrderShipmentService Interface

- Create a service interface `BeerOrderShipmentService` in the package `guru.springframework.juniemvc.services`
- Define methods for CRUD operations:
  - `List<BeerOrderShipmentDto> getAllShipmentsByBeerOrderId(Integer beerOrderId)`
  - `Optional<BeerOrderShipmentDto> getShipmentById(Integer id)`
  - `BeerOrderShipmentDto saveShipment(Integer beerOrderId, BeerOrderShipmentDto beerOrderShipmentDto)`
  - `void deleteShipmentById(Integer id)`
  - Other helper methods as needed

## 10. Create BeerOrderShipmentServiceImpl

- Create a service implementation class `BeerOrderShipmentServiceImpl` in the package `guru.springframework.juniemvc.services`
- Implement the `BeerOrderShipmentService` interface
- Use constructor injection for dependencies (BeerOrderShipmentRepository, BeerOrderRepository, BeerOrderShipmentMapper)
- Implement the service methods with proper transaction boundaries:
  - Annotate read-only methods with `@Transactional(readOnly = true)`
  - Annotate data-modifying methods with `@Transactional`
- Add validation and error handling logic
- Add appropriate logging

## 11. Create BeerOrderShipmentController

- Create a controller class `BeerOrderShipmentController` in the package `guru.springframework.juniemvc.controllers`
- Annotate with `@RestController` and `@RequestMapping("/api/v1/beer-orders/{beerOrderId}/shipments")`
- Use constructor injection for the BeerOrderShipmentService
- Implement the RESTful CRUD operations:
  - `getAllShipments(@PathVariable Integer beerOrderId)` - GET mapping
  - `getShipmentById(@PathVariable Integer beerOrderId, @PathVariable Integer id)` - GET mapping with ID
  - `createShipment(@PathVariable Integer beerOrderId, @Valid @RequestBody BeerOrderShipmentDto shipmentDto)` - POST mapping
  - `updateShipment(@PathVariable Integer beerOrderId, @PathVariable Integer id, @Valid @RequestBody BeerOrderShipmentDto shipmentDto)` - PUT mapping with ID
  - `deleteShipment(@PathVariable Integer beerOrderId, @PathVariable Integer id)` - DELETE mapping with ID
- Return appropriate HTTP status codes (200, 201, 204, 404)
- Use ResponseEntity for responses

## 12. Update OpenAPI Documentation

- Add documentation for the new BeerOrderShipment entity and related operations
- Create or update OpenAPI schema files for the new components
- Document the API paths and operations in the OpenAPI specifications

## 13. Create Tests

### 13.1 Repository Tests
- Create `BeerOrderShipmentRepositoryTest` in the test package
- Test basic CRUD operations
- Test any custom query methods

### 13.2 Mapper Tests
- Create `BeerOrderShipmentMapperTest` in the test package
- Test entity-to-DTO and DTO-to-entity conversion
- Test update method

### 13.3 Service Tests
- Create `BeerOrderShipmentServiceImplTest` in the test package
- Test all service methods
- Use MockMvc for testing
- Mock dependencies (repositories, mappers)

### 13.4 Controller Tests
- Create `BeerOrderShipmentControllerTest` in the test package
- Test all controller endpoints
- Use MockMvc for testing
- Mock service layer

### 13.5 Integration Tests
- Create integration tests to verify the complete flow
- Test the API endpoints with real data
- Use @SpringBootTest with a random port

## 14. Verify

- Run all tests to ensure they pass
- Manually test the API endpoints using a REST client
- Verify that all requirements are met
- Ensure that the code follows the Spring Boot Guidelines