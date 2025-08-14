package guru.springframework.juniemvc.entities;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

/**
 * Tests for BeerOrderShipment entity
 */
class BeerOrderShipmentTest {

    @Test
    void testBeerOrderShipmentProperties() {
        // Create a beer order shipment
        LocalDateTime shipmentDate = LocalDateTime.now();
        BeerOrderShipment shipment = BeerOrderShipment.builder()
                .shipmentDate(shipmentDate)
                .carrier("FedEx")
                .trackingNumber("123456789")
                .build();

        // Verify properties
        assertThat(shipment).isNotNull();
        assertThat(shipment.getShipmentDate()).isEqualTo(shipmentDate);
        assertThat(shipment.getCarrier()).isEqualTo("FedEx");
        assertThat(shipment.getTrackingNumber()).isEqualTo("123456789");
    }

    @Test
    void testBeerOrderRelationship() {
        // Create a beer order
        BeerOrder beerOrder = BeerOrder.builder()
                .status("NEW")
                .build();

        // Create a beer order shipment
        BeerOrderShipment shipment = BeerOrderShipment.builder()
                .shipmentDate(LocalDateTime.now())
                .carrier("UPS")
                .trackingNumber("987654321")
                .build();

        // Add shipment to beer order
        beerOrder.addShipment(shipment);

        // Verify relationship
        assertThat(beerOrder.getShipments()).hasSize(1);
        assertThat(beerOrder.getShipments()).contains(shipment);
        assertThat(shipment.getBeerOrder()).isEqualTo(beerOrder);

        // Test removing shipment
        beerOrder.removeShipment(shipment);
        assertThat(beerOrder.getShipments()).isEmpty();
        assertThat(shipment.getBeerOrder()).isNull();
    }
}