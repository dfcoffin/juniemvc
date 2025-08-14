package guru.springframework.juniemvc.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Entity representing a shipment for a beer order
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeerOrderShipment extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "beer_order_id")
    private BeerOrder beerOrder;

    private LocalDateTime shipmentDate;
    private String carrier;
    private String trackingNumber;
}