# Beer Order Shipment Implementation Task List

## 1. Entity Implementation
1. [x] Create `BeerOrderShipment` entity class in `guru.springframework.juniemvc.entities` package
   - [x] Extend `BaseEntity` class
   - [x] Add `shipmentDate` (LocalDateTime) field with not null constraint
   - [x] Add `carrier` (String) field
   - [x] Add `trackingNumber` (String) field
   - [x] Add ManyToOne relationship with `BeerOrder` entity
   - [x] Add JPA annotations
   - [x] Add Lombok annotations (@Getter, @Setter, @Builder, etc.)

2. [x] Update `BeerOrder` entity
   - [x] Add OneToMany relationship field for BeerOrderShipments with cascade and orphan removal
   - [x] Add helper method `addBeerOrderShipment(BeerOrderShipment shipment)`
   - [x] Add helper method `removeBeerOrderShipment(BeerOrderShipment shipment)`

## 2. Database Migration
3. [x] Create Flyway migration script `V3__add_beer_order_shipment_table.sql`
   - [x] Create `beer_order_shipment` table with required columns
   - [x] Add foreign key constraint to establish relationship with `BeerOrder`

## 3. DTO Implementation
4. [x] Create `BeerOrderShipmentDto` class in `guru.springframework.juniemvc.models` package
   - [x] Extend `BaseEntityDto` class
   - [x] Add fields matching entity: `shipmentDate`, `carrier`, `trackingNumber`
   - [x] Add validation annotations (@NotNull for shipmentDate)
   - [x] Add Lombok annotations (@Getter, @Setter, @SuperBuilder, etc.)

5. [x] Update `BeerOrderDto` class
   - [x] Add field for shipments: `Set<BeerOrderShipmentDto> beerOrderShipments`
   - [x] Update constructors and builder

## 4. Mapper Implementation
6. [x] Create `BeerOrderShipmentMapper` interface in `guru.springframework.juniemvc.mappers` package
   - [x] Add @Mapper annotation with Spring component model
   - [x] Define entity-to-DTO conversion method
   - [x] Define DTO-to-entity conversion method
   - [x] Define update method

7. [x] Update `BeerOrderMapper` interface
   - [x] Add BeerOrderShipmentMapper to the `uses` attribute
   - [x] Update mapping methods to include shipments field

## 5. Repository Implementation
8. [x] Create `BeerOrderShipmentRepository` interface in `guru.springframework.juniemvc.repositories` package
   - [x] Extend JpaRepository<BeerOrderShipment, Integer>
   - [x] Add @Repository annotation
   - [x] Add custom query methods if needed

## 6. Service Implementation
9. [x] Create `BeerOrderShipmentService` interface in `guru.springframework.juniemvc.services` package
   - [x] Define method `List<BeerOrderShipmentDto> getAllShipmentsByBeerOrderId(Integer beerOrderId)`
   - [x] Define method `Optional<BeerOrderShipmentDto> getShipmentById(Integer id)`
   - [x] Define method `BeerOrderShipmentDto saveShipment(Integer beerOrderId, BeerOrderShipmentDto beerOrderShipmentDto)`
   - [x] Define method `void deleteShipmentById(Integer id)`

10. [x] Create `BeerOrderShipmentServiceImpl` class in `guru.springframework.juniemvc.services` package
    - [x] Implement `BeerOrderShipmentService` interface
    - [x] Add constructor injection for dependencies
    - [x] Implement service methods with proper transaction boundaries
    - [x] Add validation and error handling
    - [x] Add appropriate logging

## 7. Controller Implementation
11. [x] Create `BeerOrderShipmentController` class in `guru.springframework.juniemvc.controllers` package
    - [x] Add @RestController and @RequestMapping annotations
    - [x] Add constructor injection for BeerOrderShipmentService
    - [x] Implement GET mapping for retrieving all shipments
    - [x] Implement GET mapping with ID for retrieving a specific shipment
    - [x] Implement POST mapping for creating a shipment
    - [x] Implement PUT mapping with ID for updating a shipment
    - [x] Implement DELETE mapping with ID for deleting a shipment
    - [x] Return appropriate HTTP status codes
    - [x] Use ResponseEntity for responses

## 8. OpenAPI Documentation
12. [x] Update OpenAPI documentation
    - [x] Add schema for BeerOrderShipment
    - [x] Document API paths and operations

## 9. Testing
13. [x] Create Repository Tests
    - [x] Create `BeerOrderShipmentRepositoryTest` class
    - [x] Test basic CRUD operations
    - [x] Test any custom query methods

14. [x] Create Mapper Tests
    - [x] Create `BeerOrderShipmentMapperTest` class
    - [x] Test entity-to-DTO and DTO-to-entity conversion
    - [x] Test update method

15. [x] Create Service Tests
    - [x] Create `BeerOrderShipmentServiceImplTest` class
    - [x] Test all service methods
    - [x] Mock dependencies

16. [x] Create Controller Tests
    - [x] Create `BeerOrderShipmentControllerTest` class
    - [x] Test all controller endpoints
    - [x] Use MockMvc for testing
    - [x] Mock service layer

17. [x] Create Integration Tests
    - [x] Create integration tests for complete flow
    - [x] Test API endpoints with real data
    - [x] Use @SpringBootTest with a random port

## 10. Verification
18. [x] Run all tests to ensure they pass
19. [x] Manually test the API endpoints
20. [x] Verify all requirements are met
21. [x] Ensure code follows Spring Boot Guidelines