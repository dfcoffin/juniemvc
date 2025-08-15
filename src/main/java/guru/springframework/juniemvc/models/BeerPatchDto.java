package guru.springframework.juniemvc.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

/**
 * DTO for Beer patch operations
 * This DTO is used for partial updates and does not have any validation constraints
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class BeerPatchDto extends BaseEntityDto {

    private String beerName;
    private String beerStyle;
    private String upc;
    private Integer quantityOnHand;
    private String description;
    private BigDecimal price;
}