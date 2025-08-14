# Requirements: Implementing Beer Order Shipment Entity

## Overview
This document outlines the requirements for implementing the Beer Order Shipment entity in the Beer API.

## Entity Definition
- Create a new JPA entity named `BeerOrderShipment`.
- The entity should extend the `BaseEntity` class.
- Define the following properties for the `BeerOrderShipment` entity:
  - `shipmentDate` (LocalDateTime): The date and time when the shipment was created. (not null)
  - `carrier` (String): The name of the carrier responsible for the shipment.
  - `trackingNumber` (String): The tracking number provided by the carrier.

The BeerOrderShipment entity should extend the BaseEntity.

Add Java DTOs, Mappers, Spring Data JPA Repositories, service and service implementation to support the Spring MVC 
Restful CRUD Controller. Add Tests for all components. Update the OpenAPI documentation for the new controller 
operations. Verify all tests are passing.

## Relationships
- The `BeerOrderShipment` entity should have a MnyToOne relationship with the `BeerOrder` entity.
  - A shipment can be associated with multiple beer orders.
  - A beer order can have multiple shipments.
- The `BeerOrder` entity should have a OneToMany relationship with the `BeerOrderShipment` entity.
  - Add helper methods for adding and removing shipments (similar to BeerOrderLine).

## Controller
- Implement a Spring MVC RESTful controller to handle CRUD operations for the `BeerOrderShipment` entity.
- The controller should support the following operations:
  - Create a new shipment
  - Update an existing shipment
  - Retrieve all shipments
  - Retrieve a shipment by ID
  - Delete a shipment
- The path for the controller should be `/api/v1/beer-orders/{beerOrderId}/shipments`.
- Ensure the controller methods are properly annotated with `@GetMapping`, `@PostMapping`, `@PutMapping`, and `@DeleteMapping`.
- Use appropriate response status codes (e.g., 201 for created, 200 for OK, 404 for not found).
- Implement proper exception handling for the controller methods.
- Ensure the controller is properly tested with unit tests.

## Flyway Migration
- Create a Flyway migration script to create the `beer_order_shipment` table in the database.
- The migration script should include the following:
  - Create the `beer_order_shipment` table with the necessary columns:
    - `id` (UUID, primary key)
    - `shipment_date` (TIMESTAMP, not null)
    - `carrier` (VARCHAR, nullable)
    - `tracking_number` (VARCHAR, nullable)
  - Add a foreign key constraint to the `beer_order` table to establish the relationship with the `BeerOrderShipment` entity.
- Ensure the migration script follows the Flyway naming conventions (e.g., `V3__add_beer_order_shipment_table.sql`).

## Data Transfer Objects (DTOs)
- Create a DTO class for the `BeerOrderShipment` entity.
- The DTO should extend the `BaseEntityDto` class.
- Include the same fields as the entity: `shipmentDate`, `carrier`, `trackingNumber`.
- Add appropriate validation annotations to the DTO fields.
- Implement constructor, getter/setter methods using Lombok annotations.

## Mappers
- Create a mapper interface using MapStruct to convert between the `BeerOrderShipment` entity and its DTO.
- Define methods to convert between the entity and DTO, including:
  - `toDto(BeerOrderShipment entity)`
  - `toEntity(BeerOrderShipmentDto dto)`
- Implement update methods for existing entities, such as:
  - `updateEntityFromDto(BeerOrderShipmentDto dto, BeerOrderShipment entity)`
- Ensure the mapper is properly annotated with `@Mapper` and uses the correct component model.

## Repository
- Create a repository interface for the `BeerOrderShipment` entity.
- The repository should extend `JpaRepository<BeerOrderShipment, UUID>`.
- Define any custom query methods if needed, such as finding shipments by carrier or tracking number.
- Ensure the repository is annotated with `@Repository`.
- Implement the repository interface using Spring Data JPA.
- Ensure the repository is properly tested with unit tests.
- Add tests for the repository methods to ensure correct functionality.
- Ensure the repository is properly documented with Javadoc comments.

## Service Layer
- Create a service interface for the `BeerOrderShipment` entity.
- The service interface should define the following methods:
  - `List<BeerOrderShipmentDto> getAllShipments()`
  - `BeerOrderShipmentDto getShipmentById(UUID id)`
  - `BeerOrderShipmentDto createShipment(BeerOrderShipmentDto dto)`
  - `BeerOrderShipmentDto updateShipment(UUID id, BeerOrderShipmentDto dto)`
  - `void deleteShipment(UUID id)`
- Implement the service interface in a service implementation class.
- Use constructor injection for dependencies.
- Implement proper exception handling for service methods.
- Ensure the service methods are properly annotated with `@Service`.
- Follow transactional boundaries as per the guidelines.
- Ensure the service implementation is properly tested with unit tests.
- Add tests for the service methods to ensure correct functionality.
- Ensure the service implementation is properly documented with Javadoc comments.
