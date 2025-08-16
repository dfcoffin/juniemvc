# Beer Order System Requirements

## Overview
This document outlines the requirements for implementing a Beer Order System as an extension to the existing Beer management functionality. The system will allow creating, reading, updating, and deleting beer orders and their line items.

## Data Model

### Entities

#### 1. BaseEntity
Create a base entity class to handle common fields across all entities:

```java
@MappedSuperclass
@Getter
@Setter
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Version
    private Integer version;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    private LocalDateTime updateDate;
}
```

#### 2. Beer Entity (Existing)
Update the existing Beer entity to include a relationship with BeerOrderLine:

```java
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Beer extends BaseEntity {

    private String beerName;
    private String beerStyle;
    private String upc;
    private Integer quantityOnHand;
    private BigDecimal price;

    // Bidirectional relationship with BeerOrderLine
    @OneToMany(mappedBy = "beer")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<BeerOrderLine> beerOrderLines = new HashSet<>();
}
```

#### 3. BeerOrder Entity
Create a new entity to represent a beer order:

```java
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class BeerOrder extends BaseEntity {

    private String customerRef;

    @Column(precision = 19, scale = 2)
    private BigDecimal paymentAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    // Bidirectional relationship with BeerOrderLine
    @OneToMany(mappedBy = "beerOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<BeerOrderLine> beerOrderLines = new HashSet<>();

    // Helper method to manage bidirectional relationship
    public void addBeerOrderLine(BeerOrderLine line) {
        if (beerOrderLines == null) {
            beerOrderLines = new HashSet<>();
        }
        beerOrderLines.add(line);
        line.setBeerOrder(this);
    }

    public void removeBeerOrderLine(BeerOrderLine line) {
        beerOrderLines.remove(line);
        line.setBeerOrder(null);
    }
}
```

#### 4. BeerOrderLine Entity
Create a new entity to represent a line item in a beer order:

```java
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class BeerOrderLine extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "beer_order_id")
    private BeerOrder beerOrder;

    @ManyToOne
    @JoinColumn(name = "beer_id")
    private Beer beer;

    private Integer orderQuantity;

    private Integer quantityAllocated;

    @Enumerated(EnumType.STRING)
    private OrderLineStatus lineStatus;
}
```

#### 5. Enums
Create enums for order and line item statuses:

```java
public enum OrderStatus {
    NEW, PENDING, PROCESSING, COMPLETED, CANCELLED, DELIVERY_EXCEPTION
}

public enum OrderLineStatus {
    NEW, ALLOCATED, PENDING_INVENTORY, DELIVERED, CANCELLED
}
```

### DTOs

#### 1. BeerOrderDto
Create a DTO for beer orders:

```java
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeerOrderDto {
    private Integer id;
    private Integer version;

    @NotBlank(message = "Customer reference is required")
    @Size(max = 255)
    private String customerRef;

    @NotNull(message = "Payment amount is required")
    @Positive(message = "Payment amount must be positive")
    @Digits(integer = 10, fraction = 2, message = "Payment amount must have at most 10 digits and 2 decimal places")
    private BigDecimal paymentAmount;

    private OrderStatus orderStatus;

    @Valid
    @NotEmpty(message = "Order must contain at least one beer")
    private Set<BeerOrderLineDto> beerOrderLines;

    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
}
```

#### 2. BeerOrderLineDto
Create a DTO for beer order line items:

```java
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeerOrderLineDto {
    private Integer id;
    private Integer version;

    @NotNull(message = "Beer ID is required")
    private Integer beerId;

    private String beerName;
    private String beerStyle;
    private String upc;
    private BigDecimal price;

    @NotNull(message = "Order quantity is required")
    @Positive(message = "Order quantity must be positive")
    private Integer orderQuantity;

    private Integer quantityAllocated;

    private OrderLineStatus lineStatus;

    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
}
```

### Mappers

#### 1. BeerOrderMapper
Create a mapper for converting between BeerOrder entities and DTOs:

```java
@Mapper(uses = {BeerOrderLineMapper.class})
public interface BeerOrderMapper {
    BeerOrderDto beerOrderToBeerOrderDto(BeerOrder beerOrder);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updateDate", ignore = true)
    BeerOrder beerOrderDtoToBeerOrder(BeerOrderDto beerOrderDto);
}
```

#### 2. BeerOrderLineMapper
Create a mapper for converting between BeerOrderLine entities and DTOs:

```java
@Mapper(uses = {BeerMapper.class})
public interface BeerOrderLineMapper {
    @Mapping(target = "beerId", source = "beer.id")
    @Mapping(target = "beerName", source = "beer.beerName")
    @Mapping(target = "beerStyle", source = "beer.beerStyle")
    @Mapping(target = "upc", source = "beer.upc")
    @Mapping(target = "price", source = "beer.price")
    BeerOrderLineDto beerOrderLineToBeerOrderLineDto(BeerOrderLine line);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updateDate", ignore = true)
    @Mapping(target = "beer", ignore = true)
    @Mapping(target = "beerOrder", ignore = true)
    BeerOrderLine beerOrderLineDtoToBeerOrderLine(BeerOrderLineDto dto);
}
```

### Repositories

#### 1. BeerOrderRepository
Create a repository for BeerOrder entities:

```java
@Repository
public interface BeerOrderRepository extends JpaRepository<BeerOrder, Integer> {
    // Spring Data JPA will automatically implement CRUD operations
    // Custom query methods can be added as needed
}
```

#### 2. BeerOrderLineRepository
Create a repository for BeerOrderLine entities:

```java
@Repository
public interface BeerOrderLineRepository extends JpaRepository<BeerOrderLine, Integer> {
    // Spring Data JPA will automatically implement CRUD operations
    // Custom query methods can be added as needed
    List<BeerOrderLine> findByBeerOrderId(Integer beerOrderId);
}
```

### Services

#### 1. BeerOrderService
Create a service interface for beer order operations:

```java
public interface BeerOrderService {
    /**
     * Get all beer orders.
     * 
     * @return List of all beer orders
     */
    List<BeerOrderDto> getAllBeerOrders();

    /**
     * Get a beer order by its ID.
     * 
     * @param id The ID of the beer order to retrieve
     * @return Optional containing the beer order if found, empty otherwise
     */
    Optional<BeerOrderDto> getBeerOrderById(Integer id);

    /**
     * Save a beer order.
     * 
     * @param beerOrderDto The beer order to save
     * @return The saved beer order with updated ID
     */
    BeerOrderDto saveBeerOrder(BeerOrderDto beerOrderDto);

    /**
     * Update an existing beer order.
     * 
     * @param id The ID of the beer order to update
     * @param beerOrderDto The updated beer order data
     * @return Optional containing the updated beer order if found and updated, empty otherwise
     */
    Optional<BeerOrderDto> updateBeerOrderById(Integer id, BeerOrderDto beerOrderDto);

    /**
     * Delete a beer order by its ID.
     * 
     * @param id The ID of the beer order to delete
     * @return true if the beer order was found and deleted, false otherwise
     */
    boolean deleteBeerOrderById(Integer id);
}
```

#### 2. BeerOrderServiceImpl
Create a service implementation for beer order operations:

```java
@Service
@Transactional
public class BeerOrderServiceImpl implements BeerOrderService {

    private final BeerOrderRepository beerOrderRepository;
    private final BeerRepository beerRepository;
    private final BeerOrderMapper beerOrderMapper;
    private final BeerOrderLineMapper beerOrderLineMapper;

    public BeerOrderServiceImpl(BeerOrderRepository beerOrderRepository, 
                               BeerRepository beerRepository,
                               BeerOrderMapper beerOrderMapper,
                               BeerOrderLineMapper beerOrderLineMapper) {
        this.beerOrderRepository = beerOrderRepository;
        this.beerRepository = beerRepository;
        this.beerOrderMapper = beerOrderMapper;
        this.beerOrderLineMapper = beerOrderLineMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BeerOrderDto> getAllBeerOrders() {
        return beerOrderRepository.findAll().stream()
                .map(beerOrderMapper::beerOrderToBeerOrderDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<BeerOrderDto> getBeerOrderById(Integer id) {
        return beerOrderRepository.findById(id)
                .map(beerOrderMapper::beerOrderToBeerOrderDto);
    }

    @Override
    public BeerOrderDto saveBeerOrder(BeerOrderDto beerOrderDto) {
        // Set initial status for new orders
        if (beerOrderDto.getOrderStatus() == null) {
            beerOrderDto.setOrderStatus(OrderStatus.NEW);
        }

        // Convert DTO to entity
        BeerOrder beerOrder = beerOrderMapper.beerOrderDtoToBeerOrder(beerOrderDto);

        // Process each line item
        if (beerOrderDto.getBeerOrderLines() != null) {
            beerOrderDto.getBeerOrderLines().forEach(lineDto -> {
                // Set initial status for new line items
                if (lineDto.getLineStatus() == null) {
                    lineDto.setLineStatus(OrderLineStatus.NEW);
                }

                // Convert line DTO to entity
                BeerOrderLine line = beerOrderLineMapper.beerOrderLineDtoToBeerOrderLine(lineDto);

                // Set beer reference
                beerRepository.findById(lineDto.getBeerId())
                    .ifPresent(line::setBeer);

                // Add line to order
                beerOrder.addBeerOrderLine(line);
            });
        }

        // Save order
        BeerOrder savedBeerOrder = beerOrderRepository.save(beerOrder);

        // Convert back to DTO
        return beerOrderMapper.beerOrderToBeerOrderDto(savedBeerOrder);
    }

    @Override
    public Optional<BeerOrderDto> updateBeerOrderById(Integer id, BeerOrderDto beerOrderDto) {
        return beerOrderRepository.findById(id)
                .map(existingOrder -> {
                    // Update basic fields
                    existingOrder.setCustomerRef(beerOrderDto.getCustomerRef());
                    existingOrder.setPaymentAmount(beerOrderDto.getPaymentAmount());
                    existingOrder.setOrderStatus(beerOrderDto.getOrderStatus());

                    // Clear existing lines and add new ones
                    existingOrder.getBeerOrderLines().clear();

                    if (beerOrderDto.getBeerOrderLines() != null) {
                        beerOrderDto.getBeerOrderLines().forEach(lineDto -> {
                            BeerOrderLine line = beerOrderLineMapper.beerOrderLineDtoToBeerOrderLine(lineDto);

                            beerRepository.findById(lineDto.getBeerId())
                                .ifPresent(line::setBeer);

                            existingOrder.addBeerOrderLine(line);
                        });
                    }

                    return beerOrderRepository.save(existingOrder);
                })
                .map(beerOrderMapper::beerOrderToBeerOrderDto);
    }

    @Override
    public boolean deleteBeerOrderById(Integer id) {
        if (beerOrderRepository.existsById(id)) {
            beerOrderRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
```

### Controllers

#### BeerOrderController
Create a REST controller for beer order operations:

```java
@RestController
@RequestMapping(path = "/api/v1/beerorder", produces = MediaType.APPLICATION_JSON_VALUE)
public class BeerOrderController {

    private final BeerOrderService beerOrderService;

    public BeerOrderController(BeerOrderService beerOrderService) {
        this.beerOrderService = beerOrderService;
    }

    /**
     * Get all beer orders.
     * 
     * @return List of all beer orders
     */
    @GetMapping
    public List<BeerOrderDto> getAllBeerOrders() {
        return beerOrderService.getAllBeerOrders();
    }

    /**
     * Get a beer order by its ID.
     * 
     * @param id The ID of the beer order to retrieve
     * @return ResponseEntity containing the beer order if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<BeerOrderDto> getBeerOrderById(@PathVariable Integer id) {
        Optional<BeerOrderDto> beerOrderOptional = beerOrderService.getBeerOrderById(id);

        return beerOrderOptional
                .map(order -> new ResponseEntity<>(order, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Create a new beer order.
     * 
     * @param beerOrderDto The beer order to create
     * @return The created beer order with status 201 Created
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BeerOrderDto createBeerOrder(@Valid @RequestBody BeerOrderDto beerOrderDto) {
        return beerOrderService.saveBeerOrder(beerOrderDto);
    }

    /**
     * Update an existing beer order.
     * 
     * @param id The ID of the beer order to update
     * @param beerOrderDto The updated beer order data
     * @return ResponseEntity containing the updated beer order if found and updated, or 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<BeerOrderDto> updateBeerOrder(@PathVariable Integer id, @Valid @RequestBody BeerOrderDto beerOrderDto) {
        Optional<BeerOrderDto> updatedBeerOrderOptional = beerOrderService.updateBeerOrderById(id, beerOrderDto);

        return updatedBeerOrderOptional
                .map(updatedOrder -> new ResponseEntity<>(updatedOrder, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Delete a beer order by its ID.
     * 
     * @param id The ID of the beer order to delete
     * @return ResponseEntity with 204 No Content if deleted, or 404 Not Found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeerOrder(@PathVariable Integer id) {
        boolean deleted = beerOrderService.deleteBeerOrderById(id);

        return deleted ? 
                new ResponseEntity<>(HttpStatus.NO_CONTENT) : 
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
```

## Database Migration

Create a Flyway migration script to add the necessary tables:

```sql
-- Create beer_order table
CREATE TABLE beer_order (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    version INTEGER,
    customer_ref VARCHAR(255) NOT NULL,
    payment_amount DECIMAL(19, 2) NOT NULL,
    order_status VARCHAR(50) NOT NULL,
    created_date TIMESTAMP,
    update_date TIMESTAMP
);

-- Create beer_order_line table
CREATE TABLE beer_order_line (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    version INTEGER,
    beer_order_id INTEGER NOT NULL,
    beer_id INTEGER NOT NULL,
    order_quantity INTEGER NOT NULL,
    quantity_allocated INTEGER,
    line_status VARCHAR(50) NOT NULL,
    created_date TIMESTAMP,
    update_date TIMESTAMP,
    FOREIGN KEY (beer_order_id) REFERENCES beer_order(id)
    /* Add foreign key constraint for beer_id after ensuring the beer table name is correct:
    FOREIGN KEY (beer_id) REFERENCES beer(id) */
);
```

## Testing Requirements

### Entity Tests

1. **BeerOrderTest**
   - Test entity creation with all fields
   - Test bidirectional relationship with BeerOrderLine
   - Test helper methods for adding and removing lines

2. **BeerOrderLineTest**
   - Test entity creation with all fields
   - Test relationships with Beer and BeerOrder

### Repository Tests

1. **BeerOrderRepositoryTest**
   - Test CRUD operations
   - Test finding orders by ID
   - Test cascading operations (saving and deleting related line items)

2. **BeerOrderLineRepositoryTest**
   - Test CRUD operations
   - Test finding lines by beer order ID

### Service Tests

1. **BeerOrderServiceImplTest**
   - Test all service methods
   - Test validation handling
   - Test business logic for order status management
   - Test proper mapping between entities and DTOs

### Controller Tests

1. **BeerOrderControllerTest**
   - Test all REST endpoints
   - Test validation error handling
   - Test proper HTTP status codes
   - Test request and response JSON serialization/deserialization

### Integration Tests

1. **BeerOrderIntegrationTest**
   - Test the complete flow from controller to repository and back
   - Test with a real database using Testcontainers

## Validation Rules

### BeerOrderDto Validation
- customerRef: Required, maximum 255 characters
- paymentAmount: Required, positive, maximum 10 digits with 2 decimal places
- beerOrderLines: At least one line item required

### BeerOrderLineDto Validation
- beerId: Required
- orderQuantity: Required, positive

## Error Messages

### BeerOrder Error Messages
- "Customer reference is required"
- "Payment amount is required"
- "Payment amount must be positive"
- "Payment amount must have at most 10 digits and 2 decimal places"
- "Order must contain at least one beer"

### BeerOrderLine Error Messages
- "Beer ID is required"
- "Order quantity is required"
- "Order quantity must be positive"

### General Error Messages
- "Beer order not found with ID: {id}"
- "Beer not found with ID: {id}"
- "Invalid request: {validation errors}"

## Implementation Guidelines

1. Follow the existing project structure and patterns
2. Use constructor injection for dependencies
3. Use Lombok annotations to reduce boilerplate code
4. Use MapStruct for object mapping
5. Implement proper validation with descriptive error messages
6. Follow RESTful API design principles
7. Write comprehensive tests for all components
8. Use appropriate transaction boundaries
9. Handle exceptions properly
10. Document code with Javadoc comments
