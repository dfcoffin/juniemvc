package guru.springframework.juniemvc.models;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeerDto {
    private Integer id;
    private Integer version;

    @NotBlank(message = "Beer name is required")
    @Size(min = 3, max = 50)
    private String beerName;

    @NotBlank(message = "Beer style is required")
    private String beerStyle;

    @NotBlank(message = "UPC is required")
    @Size(min = 12, max = 13)
    private String upc;

    @NotNull(message = "Quantity on hand is required")
    @PositiveOrZero
    private Integer quantityOnHand;

    @NotNull(message = "Price is required")
    @Positive
    @Digits(integer = 6, fraction = 2)
    private BigDecimal price;

    private LocalDateTime createDate;
    private LocalDateTime updateDate;
}