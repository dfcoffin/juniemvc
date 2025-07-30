package guru.springframework.juniemvc.repositories;

import guru.springframework.juniemvc.entities.Beer;
import guru.springframework.juniemvc.entities.BeerOrder;
import guru.springframework.juniemvc.entities.BeerOrderLine;
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
 * Tests for the BeerOrderRepository.
 */
@DataJpaTest
class BeerOrderRepositoryTest {

    @Autowired
    BeerOrderRepository beerOrderRepository;

    @Autowired
    BeerRepository beerRepository;

    @Autowired
    BeerOrderLineRepository beerOrderLineRepository;

    private Beer testBeer;

    @BeforeEach
    void setUp() {
        // Create and save a test beer to use in order lines
        testBeer = Beer.builder()
                .beerName("Test Beer")
                .beerStyle("IPA")
                .upc("123456789012")
                .price(new BigDecimal("12.99"))
                .quantityOnHand(100)
                .build();
        testBeer = beerRepository.save(testBeer);
    }

    @Test
    void testSaveBeerOrder() {
        // Given
        BeerOrder beerOrder = BeerOrder.builder()
                .customerRef("Test Customer")
                .paymentAmount(new BigDecimal("100.00"))
                .orderStatus(OrderStatus.NEW)
                .build();

        // When
        BeerOrder savedBeerOrder = beerOrderRepository.save(beerOrder);

        // Then
        assertThat(savedBeerOrder).isNotNull();
        assertThat(savedBeerOrder.getId()).isNotNull();
        assertThat(savedBeerOrder.getCustomerRef()).isEqualTo("Test Customer");
        assertThat(savedBeerOrder.getOrderStatus()).isEqualTo(OrderStatus.NEW);
    }

    @Test
    void testGetBeerOrderById() {
        // Given
        BeerOrder beerOrder = BeerOrder.builder()
                .customerRef("Test Customer")
                .paymentAmount(new BigDecimal("100.00"))
                .orderStatus(OrderStatus.NEW)
                .build();
        BeerOrder savedBeerOrder = beerOrderRepository.save(beerOrder);

        // When
        Optional<BeerOrder> fetchedBeerOrderOptional = beerOrderRepository.findById(savedBeerOrder.getId());

        // Then
        assertThat(fetchedBeerOrderOptional).isPresent();
        BeerOrder fetchedBeerOrder = fetchedBeerOrderOptional.get();
        assertThat(fetchedBeerOrder.getCustomerRef()).isEqualTo("Test Customer");
    }

    @Test
    void testUpdateBeerOrder() {
        // Given
        BeerOrder beerOrder = BeerOrder.builder()
                .customerRef("Original Customer")
                .paymentAmount(new BigDecimal("100.00"))
                .orderStatus(OrderStatus.NEW)
                .build();
        BeerOrder savedBeerOrder = beerOrderRepository.save(beerOrder);

        // When
        savedBeerOrder.setCustomerRef("Updated Customer");
        savedBeerOrder.setOrderStatus(OrderStatus.PROCESSING);
        BeerOrder updatedBeerOrder = beerOrderRepository.save(savedBeerOrder);

        // Then
        assertThat(updatedBeerOrder.getCustomerRef()).isEqualTo("Updated Customer");
        assertThat(updatedBeerOrder.getOrderStatus()).isEqualTo(OrderStatus.PROCESSING);
    }

    @Test
    void testDeleteBeerOrder() {
        // Given
        BeerOrder beerOrder = BeerOrder.builder()
                .customerRef("Delete Me")
                .paymentAmount(new BigDecimal("100.00"))
                .orderStatus(OrderStatus.NEW)
                .build();
        BeerOrder savedBeerOrder = beerOrderRepository.save(beerOrder);

        // When
        beerOrderRepository.deleteById(savedBeerOrder.getId());
        Optional<BeerOrder> deletedBeerOrderOptional = beerOrderRepository.findById(savedBeerOrder.getId());

        // Then
        assertThat(deletedBeerOrderOptional).isEmpty();
    }

    @Test
    void testListBeerOrders() {
        // Given
        BeerOrder beerOrder1 = BeerOrder.builder()
                .customerRef("Customer One")
                .paymentAmount(new BigDecimal("100.00"))
                .orderStatus(OrderStatus.NEW)
                .build();

        BeerOrder beerOrder2 = BeerOrder.builder()
                .customerRef("Customer Two")
                .paymentAmount(new BigDecimal("200.00"))
                .orderStatus(OrderStatus.PENDING)
                .build();

        beerOrderRepository.save(beerOrder1);
        beerOrderRepository.save(beerOrder2);

        // When
        List<BeerOrder> beerOrders = beerOrderRepository.findAll();

        // Then
        assertThat(beerOrders).isNotEmpty();
        assertThat(beerOrders.size()).isGreaterThanOrEqualTo(2);
    }

    @Test
    void testCascadeSaveWithBeerOrderLines() {
        // Given
        BeerOrder beerOrder = BeerOrder.builder()
                .customerRef("Test Customer")
                .paymentAmount(new BigDecimal("100.00"))
                .orderStatus(OrderStatus.NEW)
                .build();

        BeerOrderLine beerOrderLine = BeerOrderLine.builder()
                .beer(testBeer)
                .orderQuantity(10)
                .quantityAllocated(0)
                .lineStatus(OrderLineStatus.NEW)
                .build();

        // Add the line to the order
        beerOrder.addBeerOrderLine(beerOrderLine);

        // When
        BeerOrder savedBeerOrder = beerOrderRepository.save(beerOrder);

        // Then
        assertThat(savedBeerOrder).isNotNull();
        assertThat(savedBeerOrder.getId()).isNotNull();
        assertThat(savedBeerOrder.getBeerOrderLines()).hasSize(1);

        // Verify the line was saved with the order
        List<BeerOrderLine> lines = beerOrderLineRepository.findByBeerOrderId(savedBeerOrder.getId());
        assertThat(lines).hasSize(1);
        assertThat(lines.get(0).getOrderQuantity()).isEqualTo(10);
        assertThat(lines.get(0).getBeer().getId()).isEqualTo(testBeer.getId());
    }

    @Test
    void testCascadeDeleteWithBeerOrderLines() {
        // Given
        BeerOrder beerOrder = BeerOrder.builder()
                .customerRef("Test Customer")
                .paymentAmount(new BigDecimal("100.00"))
                .orderStatus(OrderStatus.NEW)
                .build();

        BeerOrderLine beerOrderLine = BeerOrderLine.builder()
                .beer(testBeer)
                .orderQuantity(10)
                .quantityAllocated(0)
                .lineStatus(OrderLineStatus.NEW)
                .build();

        // Add the line to the order
        beerOrder.addBeerOrderLine(beerOrderLine);
        BeerOrder savedBeerOrder = beerOrderRepository.save(beerOrder);
        Integer lineId = savedBeerOrder.getBeerOrderLines().iterator().next().getId();

        // When
        beerOrderRepository.deleteById(savedBeerOrder.getId());

        // Then
        // Verify the order was deleted
        assertThat(beerOrderRepository.findById(savedBeerOrder.getId())).isEmpty();
        
        // Verify the line was also deleted due to cascade
        assertThat(beerOrderLineRepository.findById(lineId)).isEmpty();
    }
}