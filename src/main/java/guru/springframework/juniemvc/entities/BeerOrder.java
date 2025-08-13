package guru.springframework.juniemvc.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a beer order
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeerOrder extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(precision = 19, scale = 2)
    private BigDecimal paymentAmount;

    private String status;

    @OneToMany(mappedBy = "beerOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<BeerOrderLine> beerOrderLines = new HashSet<>();

    /**
     * Helper method to add a beer order line to this order
     * @param line the beer order line to add
     */
    public void addBeerOrderLine(BeerOrderLine line) {
        if (beerOrderLines == null) {
            beerOrderLines = new HashSet<>();
        }
        beerOrderLines.add(line);
        line.setBeerOrder(this);
    }

    /**
     * Helper method to remove a beer order line from this order
     * @param line the beer order line to remove
     */
    public void removeBeerOrderLine(BeerOrderLine line) {
        beerOrderLines.remove(line);
        line.setBeerOrder(null);
    }
}
