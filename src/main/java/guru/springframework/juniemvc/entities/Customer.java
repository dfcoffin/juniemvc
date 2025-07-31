package guru.springframework.juniemvc.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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

import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a customer.
 */
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Customer extends BaseEntity {

    @Column(nullable = false)
    private String name;
    
    private String email;
    
    private String phoneNumber;
    
    @Column(nullable = false)
    private String addressLine1;
    
    private String addressLine2;
    
    @Column(nullable = false)
    private String city;
    
    @Column(nullable = false)
    private String state;
    
    @Column(nullable = false)
    private String zipCode;
    
    // Bidirectional relationship with BeerOrder
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<BeerOrder> beerOrders = new HashSet<>();
    
    /**
     * Helper method to add a beer order to this customer.
     * Manages the bidirectional relationship.
     *
     * @param beerOrder The beer order to add
     */
    public void addBeerOrder(BeerOrder beerOrder) {
        if (beerOrders == null) {
            beerOrders = new HashSet<>();
        }
        beerOrders.add(beerOrder);
        beerOrder.setCustomer(this);
    }
    
    /**
     * Helper method to remove a beer order from this customer.
     * Manages the bidirectional relationship.
     *
     * @param beerOrder The beer order to remove
     */
    public void removeBeerOrder(BeerOrder beerOrder) {
        beerOrders.remove(beerOrder);
        beerOrder.setCustomer(null);
    }
}