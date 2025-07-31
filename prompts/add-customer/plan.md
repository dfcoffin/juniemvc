# Customer Entity Implementation Plan

## Overview
This plan outlines the steps to add a new Customer entity to the project, along with all necessary supporting components including DTOs, mappers, repositories, services, controllers, and tests. The Customer entity will have a one-to-many relationship with BeerOrder.

## 1. Create Customer Entity
- Create a new JPA entity class called `Customer` in the package `guru.springframework.juniemvc.entities`
- Extend the `BaseEntity` class to inherit common fields (id, version, createDate, updateDate)
- Add the following properties with appropriate annotations:
  - name (String, not null)
  - email (String)
  - phoneNumber (String)
  - addressLine1 (String, not null)
  - addressLine2 (String)
  - city (String, not null)
  - state (String, not null)
  - zipCode (String, not null)
- Add a one-to-many relationship with BeerOrder:
  ```java
  @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<BeerOrder> beerOrders = new HashSet<>();
  ```
- Add helper methods to manage the bidirectional relationship:
  ```java
  public void addBeerOrder(BeerOrder beerOrder) {
      beerOrders.add(beerOrder);
      beerOrder.setCustomer(this);
  }

  public void removeBeerOrder(BeerOrder beerOrder) {
      beerOrders.remove(beerOrder);
      beerOrder.setCustomer(null);
  }
  ```

## 2. Update BeerOrder Entity
- Add a many-to-one relationship with Customer:
  ```java
  @ManyToOne
  private Customer customer;
  ```
- Update the existing code to use the Customer entity instead of the customerRef field

## 3. Create Flyway Migration Script
- Create a new migration script in `src/main/resources/db/migration` named `V2__add_customer_table.sql`
- Add SQL to create the customer table with all required fields
- Add SQL to modify the beer_order table to add a customer_id column and foreign key constraint
- Add SQL to migrate existing data (if any) from customer_ref to the new relationship

## 4. Create Customer DTO
- Create a new DTO class called `CustomerDto` in the package `guru.springframework.juniemvc.models`
- Include all the same fields as the Customer entity
- Add appropriate validation annotations:
  - @NotBlank for required fields (name, addressLine1, city, state, zipCode)
  - @Email for the email field
- Use Lombok annotations (@Data, @Builder, @NoArgsConstructor, @AllArgsConstructor) to reduce boilerplate

## 5. Update BeerOrderDto
- Add a reference to CustomerDto in the BeerOrderDto class
- Update any related code that uses the customerRef field

## 6. Create Customer Mapper
- Create a new mapper interface called `CustomerMapper` in the package `guru.springframework.juniemvc.mappers`
- Use MapStruct to generate the implementation
- Add methods to convert between Customer entity and CustomerDto:
  ```java
  @Mapper
  public interface CustomerMapper {
      CustomerDto customerToCustomerDto(Customer customer);
      Customer customerDtoToCustomer(CustomerDto customerDto);
  }
  ```

## 7. Update BeerOrderMapper
- Update the BeerOrderMapper to handle the new Customer relationship
- Ensure proper mapping between Customer/CustomerDto in the conversion methods

## 8. Create Customer Repository
- Create a new repository interface called `CustomerRepository` in the package `guru.springframework.juniemvc.repositories`
- Extend JpaRepository for basic CRUD operations:
  ```java
  @Repository
  public interface CustomerRepository extends JpaRepository<Customer, Integer> {
      // Add any custom query methods if needed
  }
  ```

## 9. Create Customer Service
- Create a service interface called `CustomerService` in the package `guru.springframework.juniemvc.service`
- Define methods for CRUD operations using CustomerDto:
  ```java
  public interface CustomerService {
      List<CustomerDto> getAllCustomers();
      Optional<CustomerDto> getCustomerById(Integer id);
      CustomerDto saveCustomer(CustomerDto customerDto);
      Optional<CustomerDto> updateCustomerById(Integer id, CustomerDto customerDto);
      boolean deleteCustomerById(Integer id);
  }
  ```

## 10. Create Customer Service Implementation
- Create a service implementation called `CustomerServiceImpl` in the package `guru.springframework.juniemvc.service`
- Implement all methods defined in the CustomerService interface
- Use the CustomerRepository and CustomerMapper for database operations and DTO conversions
- Add appropriate transaction annotations (@Transactional)

## 11. Create Customer Controller
- Create a REST controller called `CustomerController` in the package `guru.springframework.juniemvc.controllers`
- Implement endpoints for CRUD operations:
  - GET /api/v1/customers - Get all customers
  - GET /api/v1/customers/{id} - Get customer by ID
  - POST /api/v1/customers - Create a new customer
  - PUT /api/v1/customers/{id} - Update an existing customer
  - DELETE /api/v1/customers/{id} - Delete a customer
- Add appropriate validation and error handling

## 12. Update OpenAPI Documentation
- Create a new schema definition for CustomerDto in `openapi/openapi/components/schemas/CustomerDto.yaml`
- Add path definitions for the new Customer endpoints:
  - `openapi/openapi/paths/customers.yaml` - For collection operations (GET all, POST)
  - `openapi/openapi/paths/customers_{id}.yaml` - For instance operations (GET by ID, PUT, DELETE)
- Update any existing schemas or paths that reference the customer (e.g., BeerOrderDto)

## 13. Write Tests
- Write unit tests for all new components:
  - CustomerMapperTest - Test entity-DTO conversions
  - CustomerServiceImplTest - Test service methods with mocked repository
  - CustomerControllerTest - Test REST endpoints with MockMvc
- Write integration tests:
  - CustomerRepositoryTest - Test database operations
  - CustomerControllerIT - Test end-to-end API functionality

## 14. Verify and Refine
- Run all tests to ensure everything works correctly
- Check for any edge cases or potential issues
- Refine the implementation as needed
- Ensure all requirements are met

## Implementation Approach
1. Start with the entity and database migration to establish the data model
2. Create the DTO and mapper for data conversion
3. Implement the repository and service layer for business logic
4. Create the controller for the REST API
5. Update the OpenAPI documentation
6. Write tests for all components
7. Verify the implementation meets all requirements

This approach ensures a systematic implementation of the Customer entity and all related components, following the existing patterns in the project.