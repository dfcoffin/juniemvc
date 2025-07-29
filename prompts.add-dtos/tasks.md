# DTO Implementation Task List

## 1. Create DTO and Mapper
- [ ] 1.1. Create package `guru.springframework.juniemvc.models`
- [ ] 1.2. Create `BeerDto` class with all required properties
- [ ] 1.3. Apply Lombok annotations to `BeerDto`
- [ ] 1.4. Apply Jakarta Validation annotations to `BeerDto` fields
- [ ] 1.5. Create package `guru.springframework.juniemvc.mappers`
- [ ] 1.6. Create `BeerMapper` interface with MapStruct annotations
- [ ] 1.7. Define mapping methods in `BeerMapper`
- [ ] 1.8. Configure mapper to ignore id, createDate, and updateDate when mapping from DTO to entity
- [ ] 1.9. Add MapStruct dependency to pom.xml

## 2. Update Service Layer
- [ ] 2.1. Modify `BeerService` interface to use `BeerDto` instead of `Beer` entity
- [ ] 2.2. Update `BeerServiceImpl` to inject `BeerMapper`
- [ ] 2.3. Update `BeerServiceImpl` methods to use mapper for entity-DTO conversions
- [ ] 2.4. Update `getAllBeers()` to return a list of `BeerDto` objects
- [ ] 2.5. Update `getBeerById()` to return an Optional of `BeerDto`
- [ ] 2.6. Update `saveBeer()` to accept and return `BeerDto`
- [ ] 2.7. Update `updateBeerById()` to accept `BeerDto` and return Optional of `BeerDto`
- [ ] 2.8. Ensure `deleteBeerById()` still works correctly with the updated service

## 3. Update Controller Layer
- [ ] 3.1. Modify `BeerController` to use `BeerDto` instead of `Beer` entity
- [ ] 3.2. Update controller method return types to use `BeerDto`
- [ ] 3.3. Update controller method parameter types to use `BeerDto`
- [ ] 3.4. Add `@Valid` annotation to method parameters that accept `BeerDto` objects
- [ ] 3.5. Ensure all endpoints maintain the same REST API contract

## 4. Implement Validation Error Handling
- [ ] 4.1. Create package `guru.springframework.juniemvc.exceptions`
- [ ] 4.2. Create `GlobalExceptionHandler` class with `@RestControllerAdvice` annotation
- [ ] 4.3. Implement exception handler for `MethodArgumentNotValidException`
- [ ] 4.4. Implement exception handler for `ConstraintViolationException`
- [ ] 4.5. Return appropriate HTTP status codes and error messages

## 5. Update Tests
- [ ] 5.1. Update `BeerControllerTest` to use `BeerDto` instead of `Beer` entity
- [ ] 5.2. Add validation tests for valid DTOs
- [ ] 5.3. Add validation tests for invalid DTOs
- [ ] 5.4. Test the global exception handler for validation errors
- [ ] 5.5. Update `BeerServiceImplTest` to use `BeerDto` instead of `Beer` entity
- [ ] 5.6. Ensure all tests pass with the updated implementation

## 6. Documentation and Review
- [ ] 6.1. Update API documentation to reflect DTO usage
- [ ] 6.2. Review code for adherence to best practices
- [ ] 6.3. Verify all requirements have been met
- [ ] 6.4. Perform manual testing of the API endpoints
- [ ] 6.5. Address any issues found during testing