package guru.springframework.juniemvc.models;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

/**
 * DTO for BeerOrderShipment entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class BeerOrderShipmentDto extends BaseEntityDto {

    @NotNull(message = "Shipment date is required")
    private LocalDateTime shipmentDate;
    
    private String carrier;
    private String trackingNumber;
}