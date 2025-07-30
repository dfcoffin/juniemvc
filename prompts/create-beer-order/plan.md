# Implementation Plan for Beer Order System

## Overview
This document outlines the implementation plan for the Beer Order System as an extension to the existing Beer management functionality. The plan is based on the requirements specified in `requirements.md` and follows the existing project structure and patterns.

## Implementation Steps

### 1. Create Base Entity
- Create a `BaseEntity` abstract class to extract common fields from existing entities
- Move common fields (id, version, creation/update timestamps) from `Beer` to `BaseEntity`
- Update `Beer` to extend `BaseEntity`

### 2. Create Enums
- Create `OrderStatus` enum with values: NEW, PENDING, PROCESSING, COMPLETED, CANCELLED, DELIVERY_EXCEPTION
- Create `OrderLineStatus` enum with values: NEW, ALLOCATED, PENDING_INVENTORY, DELIVERED, CANCELLED

### 3. Create Entities
- Create `BeerOrder` entity extending `BaseEntity`
  - Add fields: customerRef, paymentAmount, orderStatus
  - Add bidirectional relationship with `BeerOrderLine`
  - Implement helper methods for managing the relationship
- Create `BeerOrderLine` entity extending `BaseEntity`
  - Add fields: orderQuantity, quantityAllocated, lineStatus
  - Add many-to-one relationships with `BeerOrder` and `Beer`
- Update `Beer` entity to include bidirectional relationship with `BeerOrderLine`

### 4. Create DTOs
- Create `BeerOrderDto` with appropriate fields and validation annotations
- Create `BeerOrderLineDto` with appropriate fields and validation annotations

### 5. Create Mappers
- Create `BeerOrderMapper` interface using MapStruct
  - Add methods for mapping between `BeerOrder` and `BeerOrderDto`
- Create `BeerOrderLineMapper` interface using MapStruct
  - Add methods for mapping between `BeerOrderLine` and `BeerOrderLineDto`

### 6. Create Repositories
- Create `BeerOrderRepository` extending JpaRepository
- Create `BeerOrderLineRepository` extending JpaRepository
  - Add method to find lines by beer order ID

### 7. Create Services
- Create `BeerOrderService` interface
  - Define methods for CRUD operations
- Create `BeerOrderServiceImpl` implementing `BeerOrderService`
  - Implement all methods defined in the interface
  - Use constructor injection for dependencies
  - Add appropriate transaction annotations

### 8. Create Controllers
- Create `BeerOrderController` for REST endpoints
  - Map to "/api/v1/beerorder"
  - Implement endpoints for CRUD operations
  - Add validation and appropriate HTTP status codes

### 9. Database Migration
- Create Flyway migration script for `beer_order` and `beer_order_line` tables
- Add foreign key constraints

### 10. Testing
- Create entity tests
  - Test `BeerOrder` and `BeerOrderLine` creation and relationships
- Create repository tests
  - Test CRUD operations and custom queries
- Create service tests
  - Test all service methods and validation handling
- Create controller tests
  - Test all REST endpoints and HTTP status codes
- Create integration tests
  - Test the complete flow from controller to repository and back

## Implementation Details

### Entity Relationships
- `Beer` to `BeerOrderLine`: One-to-Many
- `BeerOrder` to `BeerOrderLine`: One-to-Many
- `BeerOrderLine` to `Beer`: Many-to-One
- `BeerOrderLine` to `BeerOrder`: Many-to-One

### Validation Rules
- `BeerOrderDto`:
  - customerRef: Required, maximum 255 characters
  - paymentAmount: Required, positive, maximum 10 digits with 2 decimal places
  - beerOrderLines: At least one line item required
- `BeerOrderLineDto`:
  - beerId: Required
  - orderQuantity: Required, positive

### Error Handling
- Use the existing `GlobalExceptionHandler` to handle validation errors
- Return appropriate error messages for validation failures
- Return 404 Not Found for resources that don't exist

## Best Practices to Follow
1. Use constructor injection for dependencies
2. Make dependencies final fields
3. Use appropriate transaction boundaries
4. Validate input data
5. Return appropriate HTTP status codes
6. Document code with Javadoc comments
7. Write comprehensive tests for all components

## Testing Strategy
1. Unit tests for individual components
2. Integration tests for component interactions
3. End-to-end tests for complete flows
4. Test both happy paths and error cases
5. Use Testcontainers for integration tests with a real database

## Conclusion
This implementation plan provides a structured approach to adding the Beer Order System to the existing project. By following this plan, we can ensure that all requirements are met and that the implementation follows the existing project structure and patterns.