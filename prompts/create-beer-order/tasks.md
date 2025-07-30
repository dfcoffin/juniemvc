# Beer Order System Implementation Tasks

## 1. Create Base Entity
- [x] 1.1. Create a `BaseEntity` abstract class to extract common fields from existing entities
- [x] 1.2. Move common fields (id, version, creation/update timestamps) from `Beer` to `BaseEntity`
- [x] 1.3. Update `Beer` to extend `BaseEntity`

## 2. Create Enums
- [x] 2.1. Create `OrderStatus` enum with values: NEW, PENDING, PROCESSING, COMPLETED, CANCELLED, DELIVERY_EXCEPTION
- [x] 2.2. Create `OrderLineStatus` enum with values: NEW, ALLOCATED, PENDING_INVENTORY, DELIVERED, CANCELLED

## 3. Create Entities
- [x] 3.1. Create `BeerOrder` entity extending `BaseEntity`
  - [x] 3.1.1. Add fields: customerRef, paymentAmount, orderStatus
  - [x] 3.1.2. Add bidirectional relationship with `BeerOrderLine`
  - [x] 3.1.3. Implement helper methods for managing the relationship
- [x] 3.2. Create `BeerOrderLine` entity extending `BaseEntity`
  - [x] 3.2.1. Add fields: orderQuantity, quantityAllocated, lineStatus
  - [x] 3.2.2. Add many-to-one relationships with `BeerOrder` and `Beer`
- [x] 3.3. Update `Beer` entity to include bidirectional relationship with `BeerOrderLine`

## 4. Create DTOs
- [x] 4.1. Create `BeerOrderDto` with appropriate fields and validation annotations
  - [x] 4.1.1. Add validation: customerRef (Required, maximum 255 characters)
  - [x] 4.1.2. Add validation: paymentAmount (Required, positive, maximum 10 digits with 2 decimal places)
  - [x] 4.1.3. Add validation: beerOrderLines (At least one line item required)
- [x] 4.2. Create `BeerOrderLineDto` with appropriate fields and validation annotations
  - [x] 4.2.1. Add validation: beerId (Required)
  - [x] 4.2.2. Add validation: orderQuantity (Required, positive)

## 5. Create Mappers
- [x] 5.1. Create `BeerOrderMapper` interface using MapStruct
  - [x] 5.1.1. Add methods for mapping between `BeerOrder` and `BeerOrderDto`
- [x] 5.2. Create `BeerOrderLineMapper` interface using MapStruct
  - [x] 5.2.1. Add methods for mapping between `BeerOrderLine` and `BeerOrderLineDto`

## 6. Create Repositories
- [x] 6.1. Create `BeerOrderRepository` extending JpaRepository
- [x] 6.2. Create `BeerOrderLineRepository` extending JpaRepository
  - [x] 6.2.1. Add method to find lines by beer order ID

## 7. Create Services
- [x] 7.1. Create `BeerOrderService` interface
  - [x] 7.1.1. Define methods for CRUD operations
- [x] 7.2. Create `BeerOrderServiceImpl` implementing `BeerOrderService`
  - [x] 7.2.1. Implement all methods defined in the interface
  - [x] 7.2.2. Use constructor injection for dependencies
  - [x] 7.2.3. Add appropriate transaction annotations

## 8. Create Controllers
- [x] 8.1. Create `BeerOrderController` for REST endpoints
  - [x] 8.1.1. Map to "/api/v1/beerorder"
  - [x] 8.1.2. Implement endpoints for CRUD operations
  - [x] 8.1.3. Add validation and appropriate HTTP status codes

## 9. Database Migration
- [x] 9.1. Create Flyway migration script for `beer_order` and `beer_order_line` tables
- [x] 9.2. Add foreign key constraints

## 10. Testing
- [x] 10.1. Create entity tests
  - [x] 10.1.1. Test `BeerOrder` and `BeerOrderLine` creation and relationships
- [x] 10.2. Create repository tests
  - [x] 10.2.1. Test CRUD operations and custom queries
- [x] 10.3. Create service tests
  - [x] 10.3.1. Test all service methods and validation handling
- [x] 10.4. Create controller tests
  - [x] 10.4.1. Test all REST endpoints and HTTP status codes
- [x] 10.5. Create integration tests
  - [x] 10.5.1. Test the complete flow from controller to repository and back

## 11. Documentation and Code Quality
- [x] 11.1. Add Javadoc comments to all classes and methods
- [x] 11.2. Ensure code follows best practices outlined in the plan
  - [x] 11.2.1. Use constructor injection for dependencies
  - [x] 11.2.2. Make dependencies final fields
  - [x] 11.2.3. Use appropriate transaction boundaries
  - [x] 11.2.4. Validate input data
  - [x] 11.2.5. Return appropriate HTTP status codes
- [x] 11.3. Review and refactor code for clarity and maintainability
