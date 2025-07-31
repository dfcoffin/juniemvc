# Change Requirements
Add a new entity to the project called Customer.  

The Customer entity should have the following properties:
* name - not null
* email
* phone number
* address line 1 - not null
* address line 2
* city - not null
* state - not null
* zip code - not null

The Customer entity should extend the BaseEntity has a OneToMany relationship with BeerOrder.

Add a flyway migration script for the new Customer JPQ Entity.

Add Java DTOs, Mappers, Spring Data JPA Repositories, service and service implementation to support the Spring MVC 
Restful CRUD Controller.  Add Tests for all components.  Update the OpenAPI documentation for the new controller 
operations.  Verify all tests are passing.
