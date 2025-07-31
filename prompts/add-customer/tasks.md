# Customer Entity Implementation Tasks

This document contains a detailed task list for implementing the Customer entity and related components according to the plan in `plan.md`.

## 1. Create Customer Entity
- [x] 1.1. Create a new JPA entity class called `Customer` in the package `guru.springframework.juniemvc.entities`
- [x] 1.2. Extend the `BaseEntity` class to inherit common fields
- [x] 1.3. Add required properties with appropriate annotations:
  - [x] 1.3.1. name (String, not null)
  - [x] 1.3.2. email (String)
  - [x] 1.3.3. phoneNumber (String)
  - [x] 1.3.4. addressLine1 (String, not null)
  - [x] 1.3.5. addressLine2 (String)
  - [x] 1.3.6. city (String, not null)
  - [x] 1.3.7. state (String, not null)
  - [x] 1.3.8. zipCode (String, not null)
- [x] 1.4. Add one-to-many relationship with BeerOrder
- [x] 1.5. Add helper methods to manage the bidirectional relationship:
  - [x] 1.5.1. addBeerOrder method
  - [x] 1.5.2. removeBeerOrder method

## 2. Update BeerOrder Entity
- [x] 2.1. Add many-to-one relationship with Customer
- [x] 2.2. Update existing code to use Customer entity instead of customerRef field

## 3. Create Flyway Migration Script
- [x] 3.1. Create a new migration script in `src/main/resources/db/migration` named `V2__add_customer_table.sql`
- [x] 3.2. Add SQL to create the customer table with all required fields
- [x] 3.3. Add SQL to modify the beer_order table to add a customer_id column and foreign key constraint
- [x] 3.4. Add SQL to migrate existing data (if any) from customer_ref to the new relationship

## 4. Create Customer DTO
- [x] 4.1. Create a new DTO class called `CustomerDto` in the package `guru.springframework.juniemvc.models`
- [x] 4.2. Include all the same fields as the Customer entity
- [x] 4.3. Add appropriate validation annotations:
  - [x] 4.3.1. @NotBlank for required fields (name, addressLine1, city, state, zipCode)
  - [x] 4.3.2. @Email for the email field
- [x] 4.4. Use Lombok annotations to reduce boilerplate

## 5. Update BeerOrderDto
- [x] 5.1. Add a reference to CustomerDto in the BeerOrderDto class
- [x] 5.2. Update any related code that uses the customerRef field

## 6. Create Customer Mapper
- [x] 6.1. Create a new mapper interface called `CustomerMapper` in the package `guru.springframework.juniemvc.mappers`
- [x] 6.2. Use MapStruct to generate the implementation
- [x] 6.3. Add methods to convert between Customer entity and CustomerDto

## 7. Update BeerOrderMapper
- [x] 7.1. Update the BeerOrderMapper to handle the new Customer relationship
- [x] 7.2. Ensure proper mapping between Customer/CustomerDto in the conversion methods

## 8. Create Customer Repository
- [x] 8.1. Create a new repository interface called `CustomerRepository` in the package `guru.springframework.juniemvc.repositories`
- [x] 8.2. Extend JpaRepository for basic CRUD operations
- [x] 8.3. Add any custom query methods if needed

## 9. Create Customer Service
- [x] 9.1. Create a service interface called `CustomerService` in the package `guru.springframework.juniemvc.service`
- [x] 9.2. Define methods for CRUD operations using CustomerDto:
  - [x] 9.2.1. getAllCustomers method
  - [x] 9.2.2. getCustomerById method
  - [x] 9.2.3. saveCustomer method
  - [x] 9.2.4. updateCustomerById method
  - [x] 9.2.5. deleteCustomerById method

## 10. Create Customer Service Implementation
- [x] 10.1. Create a service implementation called `CustomerServiceImpl` in the package `guru.springframework.juniemvc.service`
- [x] 10.2. Implement all methods defined in the CustomerService interface
- [x] 10.3. Use the CustomerRepository and CustomerMapper for database operations and DTO conversions
- [x] 10.4. Add appropriate transaction annotations (@Transactional)

## 11. Create Customer Controller
- [x] 11.1. Create a REST controller called `CustomerController` in the package `guru.springframework.juniemvc.controllers`
- [x] 11.2. Implement endpoints for CRUD operations:
  - [x] 11.2.1. GET /api/v1/customers - Get all customers
  - [x] 11.2.2. GET /api/v1/customers/{id} - Get customer by ID
  - [x] 11.2.3. POST /api/v1/customers - Create a new customer
  - [x] 11.2.4. PUT /api/v1/customers/{id} - Update an existing customer
  - [x] 11.2.5. DELETE /api/v1/customers/{id} - Delete a customer
- [x] 11.3. Add appropriate validation and error handling

## 12. Update OpenAPI Documentation
- [x] 12.1. Create a new schema definition for CustomerDto in `openapi/openapi/components/schemas/CustomerDto.yaml`
- [x] 12.2. Add path definitions for the new Customer endpoints:
  - [x] 12.2.1. `openapi/openapi/paths/customers.yaml` - For collection operations (GET all, POST)
  - [x] 12.2.2. `openapi/openapi/paths/customers_{id}.yaml` - For instance operations (GET by ID, PUT, DELETE)
- [x] 12.3. Update any existing schemas or paths that reference the customer (e.g., BeerOrderDto)

## 13. Write Tests
- [x] 13.1. Write unit tests for all new components:
  - [x] 13.1.1. CustomerMapperTest - Test entity-DTO conversions
  - [x] 13.1.2. CustomerServiceImplTest - Test service methods with mocked repository
  - [x] 13.1.3. CustomerControllerTest - Test REST endpoints with MockMvc
- [x] 13.2. Write integration tests:
  - [x] 13.2.1. CustomerRepositoryTest - Test database operations
  - [x] 13.2.2. CustomerControllerIT - Test end-to-end API functionality

## 14. Verify and Refine
- [x] 14.1. Run all tests to ensure everything works correctly
- [x] 14.2. Check for any edge cases or potential issues
- [x] 14.3. Refine the implementation as needed
- [x] 14.4. Ensure all requirements are met
