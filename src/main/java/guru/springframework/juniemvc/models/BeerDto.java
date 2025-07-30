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

    //read only
    private Integer id;
    private Integer version;

    @NotBlank(message = "Beer name is required")
    @Size(min = 3, max = 50)
    private String beerName;

    // style of beer Ale, Pale Ale, IPA, etc.
    @NotBlank(message = "Beer style is required")
    private String beerStyle;

    // Universal Product Code, a 13-digit number assigned to each unique beer product by the Federal Bar Association
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

    //read only created date
    private LocalDateTime createDate;

    //read only updated date
    private LocalDateTime updateDate;
}