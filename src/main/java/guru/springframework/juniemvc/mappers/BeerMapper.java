package guru.springframework.juniemvc.mappers;

import guru.springframework.juniemvc.entities.Beer;
import guru.springframework.juniemvc.models.BeerDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * Mapper for Beer entity and BeerDto
 */
@Mapper(componentModel = "spring")
public interface BeerMapper {

    BeerDto beerToBeerDto(Beer beer);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updateDate", ignore = true)
    @Mapping(target = "beerOrderLines", ignore = true)
    Beer beerDtoToBeer(BeerDto beerDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updateDate", ignore = true)
    @Mapping(target = "beerOrderLines", ignore = true)
    void updateBeerFromDto(BeerDto beerDto, @MappingTarget Beer beer);
}
