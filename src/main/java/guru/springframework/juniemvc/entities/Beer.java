package guru.springframework.juniemvc.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@SuperBuilder
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
    @Builder.Default
    private Set<BeerOrderLine> beerOrderLines = new HashSet<>();

    /**
     * Helper method to add a beer order line to this beer.
     * Manages the bidirectional relationship.
     *
     * @param line The beer order line to add
     */
    public void addBeerOrderLine(BeerOrderLine line) {
        if (beerOrderLines == null) {
            beerOrderLines = new HashSet<>();
        }
        beerOrderLines.add(line);
        line.setBeer(this);
    }

    /**
     * Helper method to remove a beer order line from this beer.
     * Manages the bidirectional relationship.
     *
     * @param line The beer order line to remove
     */
    public void removeBeerOrderLine(BeerOrderLine line) {
        beerOrderLines.remove(line);
        line.setBeer(null);
    }
}
