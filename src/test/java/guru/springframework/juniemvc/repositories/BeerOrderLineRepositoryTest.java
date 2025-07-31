package guru.springframework.juniemvc.repositories;

import guru.springframework.juniemvc.entities.Beer;
import guru.springframework.juniemvc.entities.BeerOrder;
import guru.springframework.juniemvc.entities.BeerOrderLine;
import guru.springframework.juniemvc.entities.Customer;
import guru.springframework.juniemvc.entities.OrderLineStatus;
import guru.springframework.juniemvc.entities.OrderStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests for the BeerOrderLineRepository.
 */
@DataJpaTest
class BeerOrderLineRepositoryTest {

    @Autowired
    BeerOrderLineRepository beerOrderLineRepository;

    @Autowired
    BeerOrderRepository beerOrderRepository;

    @Autowired
    BeerRepository beerRepository;

    @Autowired
    CustomerRepository customerRepository;

    private Beer testBeer;
    private BeerOrder testBeerOrder;
    private Customer testCustomer;

    private Customer createTestCustomer(String name) {
        return Customer.builder()
                .name(name)
                .addressLine1("123 Test St")
                .city("Test City")
                .state("TS")
                .zipCode("12345")
                .build();
    }

    @BeforeEach
    void setUp() {
        // Create and save a test customer
        testCustomer = createTestCustomer("Test Customer");
        testCustomer = customerRepository.save(testCustomer);

        // Create and save a test beer
        testBeer = Beer.builder()
                .beerName("Test Beer")
                .beerStyle("IPA")
                .upc("123456789012")
                .price(new BigDecimal("12.99"))
                .quantityOnHand(100)
                .build();
        testBeer = beerRepository.save(testBeer);

        // Create and save a test beer order
        testBeerOrder = BeerOrder.builder()
                .customer(testCustomer)
                .paymentAmount(new BigDecimal("100.00"))
                .orderStatus(OrderStatus.NEW)
                .build();
        testBeerOrder = beerOrderRepository.save(testBeerOrder);
    }

    @Test
    void testSaveBeerOrderLine() {
        // Given
        BeerOrderLine beerOrderLine = BeerOrderLine.builder()
                .beerOrder(testBeerOrder)
                .beer(testBeer)
                .orderQuantity(10)
                .quantityAllocated(5)
                .lineStatus(OrderLineStatus.NEW)
                .build();

        // When
        BeerOrderLine savedBeerOrderLine = beerOrderLineRepository.save(beerOrderLine);

        // Then
        assertThat(savedBeerOrderLine).isNotNull();
        assertThat(savedBeerOrderLine.getId()).isNotNull();
        assertThat(savedBeerOrderLine.getOrderQuantity()).isEqualTo(10);
        assertThat(savedBeerOrderLine.getQuantityAllocated()).isEqualTo(5);
        assertThat(savedBeerOrderLine.getLineStatus()).isEqualTo(OrderLineStatus.NEW);
        assertThat(savedBeerOrderLine.getBeerOrder().getId()).isEqualTo(testBeerOrder.getId());
        assertThat(savedBeerOrderLine.getBeer().getId()).isEqualTo(testBeer.getId());
    }

    @Test
    void testGetBeerOrderLineById() {
        // Given
        BeerOrderLine beerOrderLine = BeerOrderLine.builder()
                .beerOrder(testBeerOrder)
                .beer(testBeer)
                .orderQuantity(10)
                .quantityAllocated(5)
                .lineStatus(OrderLineStatus.NEW)
                .build();
        BeerOrderLine savedBeerOrderLine = beerOrderLineRepository.save(beerOrderLine);

        // When
        Optional<BeerOrderLine> fetchedBeerOrderLineOptional = beerOrderLineRepository.findById(savedBeerOrderLine.getId());

        // Then
        assertThat(fetchedBeerOrderLineOptional).isPresent();
        BeerOrderLine fetchedBeerOrderLine = fetchedBeerOrderLineOptional.get();
        assertThat(fetchedBeerOrderLine.getOrderQuantity()).isEqualTo(10);
        assertThat(fetchedBeerOrderLine.getBeer().getId()).isEqualTo(testBeer.getId());
    }

    @Test
    void testUpdateBeerOrderLine() {
        // Given
        BeerOrderLine beerOrderLine = BeerOrderLine.builder()
                .beerOrder(testBeerOrder)
                .beer(testBeer)
                .orderQuantity(10)
                .quantityAllocated(5)
                .lineStatus(OrderLineStatus.NEW)
                .build();
        BeerOrderLine savedBeerOrderLine = beerOrderLineRepository.save(beerOrderLine);

        // When
        savedBeerOrderLine.setOrderQuantity(20);
        savedBeerOrderLine.setQuantityAllocated(10);
        savedBeerOrderLine.setLineStatus(OrderLineStatus.ALLOCATED);
        BeerOrderLine updatedBeerOrderLine = beerOrderLineRepository.save(savedBeerOrderLine);

        // Then
        assertThat(updatedBeerOrderLine.getOrderQuantity()).isEqualTo(20);
        assertThat(updatedBeerOrderLine.getQuantityAllocated()).isEqualTo(10);
        assertThat(updatedBeerOrderLine.getLineStatus()).isEqualTo(OrderLineStatus.ALLOCATED);
    }

    @Test
    void testDeleteBeerOrderLine() {
        // Given
        BeerOrderLine beerOrderLine = BeerOrderLine.builder()
                .beerOrder(testBeerOrder)
                .beer(testBeer)
                .orderQuantity(10)
                .quantityAllocated(5)
                .lineStatus(OrderLineStatus.NEW)
                .build();
        BeerOrderLine savedBeerOrderLine = beerOrderLineRepository.save(beerOrderLine);

        // When
        beerOrderLineRepository.deleteById(savedBeerOrderLine.getId());
        Optional<BeerOrderLine> deletedBeerOrderLineOptional = beerOrderLineRepository.findById(savedBeerOrderLine.getId());

        // Then
        assertThat(deletedBeerOrderLineOptional).isEmpty();
    }

    @Test
    void testFindByBeerOrderId() {
        // Given
        BeerOrderLine beerOrderLine1 = BeerOrderLine.builder()
                .beerOrder(testBeerOrder)
                .beer(testBeer)
                .orderQuantity(10)
                .quantityAllocated(5)
                .lineStatus(OrderLineStatus.NEW)
                .build();

        BeerOrderLine beerOrderLine2 = BeerOrderLine.builder()
                .beerOrder(testBeerOrder)
                .beer(testBeer)
                .orderQuantity(20)
                .quantityAllocated(10)
                .lineStatus(OrderLineStatus.NEW)
                .build();

        beerOrderLineRepository.save(beerOrderLine1);
        beerOrderLineRepository.save(beerOrderLine2);

        // Create another order with a line to ensure filtering works
        Customer anotherCustomer = createTestCustomer("Another Customer");
        anotherCustomer = customerRepository.save(anotherCustomer);

        BeerOrder anotherOrder = BeerOrder.builder()
                .customer(anotherCustomer)
                .paymentAmount(new BigDecimal("200.00"))
                .orderStatus(OrderStatus.NEW)
                .build();
        anotherOrder = beerOrderRepository.save(anotherOrder);

        BeerOrderLine anotherOrderLine = BeerOrderLine.builder()
                .beerOrder(anotherOrder)
                .beer(testBeer)
                .orderQuantity(30)
                .quantityAllocated(15)
                .lineStatus(OrderLineStatus.NEW)
                .build();
        beerOrderLineRepository.save(anotherOrderLine);

        // When
        List<BeerOrderLine> lines = beerOrderLineRepository.findByBeerOrderId(testBeerOrder.getId());

        // Then
        assertThat(lines).hasSize(2);
        assertThat(lines).allMatch(line -> line.getBeerOrder().getId().equals(testBeerOrder.getId()));
    }

    @Test
    void testListBeerOrderLines() {
        // Given
        BeerOrderLine beerOrderLine1 = BeerOrderLine.builder()
                .beerOrder(testBeerOrder)
                .beer(testBeer)
                .orderQuantity(10)
                .quantityAllocated(5)
                .lineStatus(OrderLineStatus.NEW)
                .build();

        BeerOrderLine beerOrderLine2 = BeerOrderLine.builder()
                .beerOrder(testBeerOrder)
                .beer(testBeer)
                .orderQuantity(20)
                .quantityAllocated(10)
                .lineStatus(OrderLineStatus.NEW)
                .build();

        beerOrderLineRepository.save(beerOrderLine1);
        beerOrderLineRepository.save(beerOrderLine2);

        // When
        List<BeerOrderLine> beerOrderLines = beerOrderLineRepository.findAll();

        // Then
        assertThat(beerOrderLines).isNotEmpty();
        assertThat(beerOrderLines.size()).isGreaterThanOrEqualTo(2);
    }
}