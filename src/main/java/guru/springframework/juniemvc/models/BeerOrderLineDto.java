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
    private Integer id;
    private Integer version;

    @NotNull(message = "Beer ID is required")
    private Integer beerId;

    private String beerName;
    private String beerStyle;
    private String upc;
    private BigDecimal price;

    @NotNull(message = "Order quantity is required")
    @Positive(message = "Order quantity must be positive")
    private Integer orderQuantity;

    private Integer quantityAllocated;

    private OrderLineStatus lineStatus;

    private LocalDateTime createDate;
    private LocalDateTime updateDate;
}
