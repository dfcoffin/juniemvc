package guru.springframework.juniemvc.mappers;

import guru.springframework.juniemvc.entities.BeerOrderShipment;
import guru.springframework.juniemvc.models.BeerOrderShipmentDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for BeerOrderShipment entity and BeerOrderShipmentDto
 */
@Mapper
public interface BeerOrderShipmentMapper {

    BeerOrderShipmentDto beerOrderShipmentToBeerOrderShipmentDto(BeerOrderShipment beerOrderShipment);

    @Mapping(target = "beerOrder", ignore = true)
    BeerOrderShipment beerOrderShipmentDtoToBeerOrderShipment(BeerOrderShipmentDto beerOrderShipmentDto);
}