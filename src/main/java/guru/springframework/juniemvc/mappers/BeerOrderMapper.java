package guru.springframework.juniemvc.mappers;

import guru.springframework.juniemvc.entities.BeerOrder;
import guru.springframework.juniemvc.models.BeerOrderDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for converting between BeerOrder entities and DTOs.
 */
@Mapper(uses = {BeerOrderLineMapper.class})
public interface BeerOrderMapper {

    BeerOrderDto beerOrderToBeerOrderDto(BeerOrder beerOrder);

    @Mapping(target = "beerOrderLines", ignore = true)
    BeerOrder beerOrderDtoToBeerOrder(BeerOrderDto beerOrderDto);
}
