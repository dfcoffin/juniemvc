package guru.springframework.juniemvc.mappers;

import guru.springframework.juniemvc.entities.BeerOrderLine;
import guru.springframework.juniemvc.models.BeerOrderLineDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for BeerOrderLine entity and BeerOrderLineDto
 */
@Mapper
public interface BeerOrderLineMapper {
    
    @Mapping(target = "beerId", source = "beer.id")
    @Mapping(target = "beerName", source = "beer.beerName")
    @Mapping(target = "beerStyle", source = "beer.beerStyle")
    @Mapping(target = "upc", source = "beer.upc")
    BeerOrderLineDto beerOrderLineToBeerOrderLineDto(BeerOrderLine beerOrderLine);
    
    @Mapping(target = "beer", ignore = true)
    @Mapping(target = "beerOrder", ignore = true)
    BeerOrderLine beerOrderLineDtoToBeerOrderLine(BeerOrderLineDto beerOrderLineDto);
}