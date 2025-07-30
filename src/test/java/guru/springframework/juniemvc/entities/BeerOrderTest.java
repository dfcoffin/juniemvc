package guru.springframework.juniemvc.entities;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for the BeerOrder entity.
 */
class BeerOrderTest {

    /**
     * Test entity creation with all fields.
     */
    @Test
    void testBeerOrderCreation() {
        BeerOrder beerOrder = BeerOrder.builder()
                .customerRef("Test Customer")
                .paymentAmount(new BigDecimal("100.00"))
                .orderStatus(OrderStatus.NEW)
                .build();

        assertNotNull(beerOrder);
        assertEquals("Test Customer", beerOrder.getCustomerRef());
        assertEquals(new BigDecimal("100.00"), beerOrder.getPaymentAmount());
        assertEquals(OrderStatus.NEW, beerOrder.getOrderStatus());
        assertNotNull(beerOrder.getBeerOrderLines());
        assertTrue(beerOrder.getBeerOrderLines().isEmpty());
    }

    /**
     * Test bidirectional relationship with BeerOrderLine.
     */
    @Test
    void testBidirectionalRelationship() {
        BeerOrder beerOrder = BeerOrder.builder()
                .customerRef("Test Customer")
                .paymentAmount(new BigDecimal("100.00"))
                .orderStatus(OrderStatus.NEW)
                .build();

        BeerOrderLine beerOrderLine = BeerOrderLine.builder()
                .orderQuantity(10)
                .quantityAllocated(5)
                .lineStatus(OrderLineStatus.NEW)
                .build();

        // Test adding a line
        beerOrder.addBeerOrderLine(beerOrderLine);

        assertEquals(1, beerOrder.getBeerOrderLines().size());
        assertEquals(beerOrder, beerOrderLine.getBeerOrder());

        // Test removing a line
        beerOrder.removeBeerOrderLine(beerOrderLine);

        assertEquals(0, beerOrder.getBeerOrderLines().size());
        assertNull(beerOrderLine.getBeerOrder());
    }

    /**
     * Test helper methods for managing the relationship.
     */
    @Test
    void testHelperMethods() {
        BeerOrder beerOrder = BeerOrder.builder()
                .customerRef("Test Customer")
                .paymentAmount(new BigDecimal("100.00"))
                .orderStatus(OrderStatus.NEW)
                .build();

        // Set beerOrderLines to null to test null check in addBeerOrderLine
        beerOrder.setBeerOrderLines(null);

        BeerOrderLine beerOrderLine = BeerOrderLine.builder()
                .orderQuantity(10)
                .quantityAllocated(5)
                .lineStatus(OrderLineStatus.NEW)
                .build();

        beerOrder.addBeerOrderLine(beerOrderLine);

        assertNotNull(beerOrder.getBeerOrderLines());
        assertEquals(1, beerOrder.getBeerOrderLines().size());
        assertEquals(beerOrder, beerOrderLine.getBeerOrder());
    }
}