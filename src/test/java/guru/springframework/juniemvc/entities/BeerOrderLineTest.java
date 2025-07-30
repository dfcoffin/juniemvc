package guru.springframework.juniemvc.entities;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for the BeerOrderLine entity.
 */
class BeerOrderLineTest {

    /**
     * Test entity creation with all fields.
     */
    @Test
    void testBeerOrderLineCreation() {
        BeerOrderLine beerOrderLine = BeerOrderLine.builder()
                .orderQuantity(10)
                .quantityAllocated(5)
                .lineStatus(OrderLineStatus.NEW)
                .build();

        assertNotNull(beerOrderLine);
        assertEquals(10, beerOrderLine.getOrderQuantity());
        assertEquals(5, beerOrderLine.getQuantityAllocated());
        assertEquals(OrderLineStatus.NEW, beerOrderLine.getLineStatus());
        assertNull(beerOrderLine.getBeerOrder());
        assertNull(beerOrderLine.getBeer());
    }

    /**
     * Test relationship with BeerOrder.
     */
    @Test
    void testRelationshipWithBeerOrder() {
        BeerOrder beerOrder = BeerOrder.builder()
                .customerRef("Test Customer")
                .paymentAmount(new BigDecimal("100.00"))
                .orderStatus(OrderStatus.NEW)
                .build();

        BeerOrderLine beerOrderLine = BeerOrderLine.builder()
                .orderQuantity(10)
                .quantityAllocated(5)
                .lineStatus(OrderLineStatus.NEW)
                .beerOrder(beerOrder)
                .build();

        assertNotNull(beerOrderLine.getBeerOrder());
        assertEquals(beerOrder, beerOrderLine.getBeerOrder());

        // Test bidirectional relationship
        beerOrder.addBeerOrderLine(beerOrderLine);
        assertTrue(beerOrder.getBeerOrderLines().contains(beerOrderLine));
    }

    /**
     * Test relationship with Beer.
     */
    @Test
    void testRelationshipWithBeer() {
        Beer beer = Beer.builder()
                .beerName("Test Beer")
                .beerStyle("IPA")
                .upc("123456789012")
                .quantityOnHand(100)
                .price(new BigDecimal("9.99"))
                .build();

        BeerOrderLine beerOrderLine = BeerOrderLine.builder()
                .orderQuantity(10)
                .quantityAllocated(5)
                .lineStatus(OrderLineStatus.NEW)
                .build();

        // Use the helper method to establish the bidirectional relationship
        beer.addBeerOrderLine(beerOrderLine);

        assertNotNull(beerOrderLine.getBeer());
        assertEquals(beer, beerOrderLine.getBeer());

        // Beer should have a bidirectional relationship with BeerOrderLine
        assertTrue(beer.getBeerOrderLines().contains(beerOrderLine));
    }
}
