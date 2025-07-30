package guru.springframework.juniemvc.models;

import guru.springframework.juniemvc.entities.OrderStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * DTO for beer orders.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeerOrderDto {

    //read only
    private Integer id;
    private Integer version;

    @NotBlank(message = "Customer reference is required")
    @Size(max = 255)
    private String customerRef;

    //Payment must have no more than 10 digits and 2 decimal places
    @NotNull(message = "Payment amount is required")
    @Positive(message = "Payment amount must be positive")
    @Digits(integer = 10, fraction = 2, message = "Payment amount must have at most 10 digits and 2 decimal places")
    private BigDecimal paymentAmount;

    // ENUM Status of the order, NEW, PAID, CANCELLED, INPROCESS, COMPLETE
    private OrderStatus orderStatus;

    // The order must have at least one beer line
    @Valid
    @NotEmpty(message = "Order must contain at least one beer")
    @Builder.Default
    private Set<BeerOrderLineDto> beerOrderLines = new HashSet<>();

    //read only created date
    private LocalDateTime createDate;

    //read only updated date
    private LocalDateTime updateDate;
}
