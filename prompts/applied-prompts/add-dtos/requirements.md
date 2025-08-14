# Requirements: Implementing DTO Pattern for Beer API

## Overview
This document outlines the requirements for implementing the Data Transfer Object (DTO) pattern in the Beer API. The goal is to separate the presentation layer from the persistence layer by introducing DTOs as intermediaries between the REST controllers and the JPA entities.

## Requirements

### 1. Create BeerDto Class
- Create a new POJO class called `BeerDto` in the package `guru.springframework.juniemvc.models`
- The DTO should have the same properties as the Beer entity:
  - Integer id
  - Integer version
  - String beerName
  - String beerStyle
  - String upc
  - Integer quantityOnHand
  - BigDecimal price
  - LocalDateTime createDate
  - LocalDateTime updateDate
- Apply the following Lombok annotations to the DTO:
  - `@Getter`
  - `@Setter`
  - `@Builder`
  - `@NoArgsConstructor`
  - `@AllArgsConstructor`

### 1.1 Apply Jakarta Validation Annotations
- Add appropriate Jakarta Validation annotations to the BeerDto class to ensure data integrity:
  - `beerName`:
    - `@NotBlank` - Ensure the beer name is not null and contains at least one non-whitespace character
    - `@Size(min = 3, max = 50)` - Ensure the beer name is between 3 and 50 characters
  - `beerStyle`:
    - `@NotBlank` - Ensure the beer style is not null and contains at least one non-whitespace character
  - `upc`:
    - `@NotBlank` - Ensure the UPC is not null and contains at least one non-whitespace character
    - `@Size(min = 12, max = 13)` - Ensure the UPC is either 12 or 13 characters long
  - `quantityOnHand`:
    - `@NotNull` - Ensure the quantity is not null
    - `@PositiveOrZero` - Ensure the quantity is zero or positive
  - `price`:
    - `@NotNull` - Ensure the price is not null
    - `@Positive` - Ensure the price is a positive value
    - `@Digits(integer = 6, fraction = 2)` - Ensure the price has at most 6 digits in the integer part and 2 in the decimal part

### 2. Create MapStruct Mapper
- Create a new interface called `BeerMapper` in the package `guru.springframework.juniemvc.mappers`
- Use the MapStruct `@Mapper` annotation with `componentModel = "spring"` to make it a Spring bean
- Define the following mapping methods:
  - `BeerDto beerToBeerDto(Beer beer)` - Convert from Beer entity to BeerDto
  - `Beer beerDtoToBeer(BeerDto beerDto)` - Convert from BeerDto to Beer entity
- When mapping from BeerDto to Beer entity, ignore the following properties:
  - id
  - createDate
  - updateDate

### 3. Update Service Layer
- Modify the `BeerService` interface to:
  - Accept BeerDto objects as parameters instead of Beer entities
  - Return BeerDto objects instead of Beer entities
- Update the `BeerServiceImpl` class to:
  - Inject the BeerMapper
  - Use the mapper to convert between DTOs and entities
  - Maintain the same business logic but operate on DTOs at the service boundary

### 4. Update Controller Layer
- Modify the `BeerController` class to:
  - Use BeerDto objects in all method signatures instead of Beer entities
  - No changes to the REST API endpoints or HTTP methods are required
  - Ensure all controller methods use the updated service methods that work with DTOs
  - Add `@Valid` annotation to method parameters that accept BeerDto objects to trigger validation
  - Ensure proper error handling for validation failures

## Implementation Guidelines
1. Maintain the existing REST API contract (URLs, HTTP methods, status codes)
2. Ensure proper error handling is preserved
3. Use constructor injection for all dependencies
4. Follow the existing code style and documentation patterns
5. The service layer should handle the conversion between DTOs and entities, not the controller
6. Implement a global exception handler for validation errors that returns appropriate HTTP status codes and error messages

### Validation Error Handling
- Create a `ControllerAdvice` class to handle validation exceptions
- Return HTTP 400 Bad Request status for validation errors
- Include clear error messages that indicate which fields failed validation and why
- Format the error response consistently with other error responses in the application

## Testing
- Update existing tests to work with the DTO pattern
- Ensure all tests pass after the changes
- Verify that the API continues to function as expected with the new DTO layer
- Add validation tests:
  - Test that valid DTOs pass validation
  - Test that invalid DTOs fail validation with appropriate error messages
  - Test the global exception handler for validation errors
