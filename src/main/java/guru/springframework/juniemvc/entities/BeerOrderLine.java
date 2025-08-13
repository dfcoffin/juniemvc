package guru.springframework.juniemvc.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity representing a line item in a beer order
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeerOrderLine extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "beer_order_id")
    private BeerOrder beerOrder;

    @ManyToOne
    @JoinColumn(name = "beer_id")
    private Beer beer;

    private Integer orderQuantity;
    private Integer quantityAllocated;
    private String status;
}