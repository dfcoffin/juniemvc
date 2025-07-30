package guru.springframework.juniemvc.models;

import guru.springframework.juniemvc.entities.OrderLineStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for beer order line items.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeerOrderLineDto {

    //read only
    private Integer id;
    private Integer version;

    @NotNull(message = "Beer ID is required")
    private Integer beerId;

    private String beerName;

    // enum Style of beer Ale, Pale Ale, IPA, etc.
    private String beerStyle;

    // Universal Product Code, a 13-digit number assigned to each unique beer product by the Federal Bar Association
    private String upc;
    private BigDecimal price;

    // Order quantity is required and must be positive
    @NotNull(message = "Order quantity is required")
    @Positive(message = "Order quantity must be positive")
    private Integer orderQuantity;

    private Integer quantityAllocated;

    private OrderLineStatus lineStatus;

    //read only created date
    private LocalDateTime createDate;

    //read only updated date
    private LocalDateTime updateDate;
}
