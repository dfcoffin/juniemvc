package guru.springframework.juniemvc.mappers;

import guru.springframework.juniemvc.entities.BeerOrder;
import guru.springframework.juniemvc.entities.BeerOrderLine;
import guru.springframework.juniemvc.entities.BeerOrderShipment;
import guru.springframework.juniemvc.models.BeerOrderDto;
import guru.springframework.juniemvc.models.BeerOrderLineDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for BeerOrder entity and BeerOrderDto
 */
@Mapper(uses = {BeerOrderLineMapper.class, CustomerMapper.class, BeerOrderShipmentMapper.class})
public interface BeerOrderMapper {

    BeerOrderDto beerOrderToBeerOrderDto(BeerOrder beerOrder);

    @Mapping(target = "beerOrderLines", ignore = true)
    @Mapping(target = "shipments", ignore = true)
    BeerOrder beerOrderDtoToBeerOrder(BeerOrderDto beerOrderDto);

    /**
     * Add beer order lines to beer order
     * @param beerOrder the beer order
     * @param beerOrderDto the beer order DTO
     * @param beerOrderLineMapper the beer order line mapper
     * @return the updated beer order
     */
    default BeerOrder addBeerOrderLines(BeerOrder beerOrder, BeerOrderDto beerOrderDto, BeerOrderLineMapper beerOrderLineMapper) {
        if (beerOrderDto.getBeerOrderLines() != null && !beerOrderDto.getBeerOrderLines().isEmpty()) {
            beerOrderDto.getBeerOrderLines().forEach(lineDto -> {
                BeerOrderLine line = beerOrderLineMapper.beerOrderLineDtoToBeerOrderLine(lineDto);
                beerOrder.addBeerOrderLine(line);
            });
        }
        return beerOrder;
    }

    /**
     * Add shipments to beer order
     * @param beerOrder the beer order
     * @param beerOrderDto the beer order DTO
     * @param beerOrderShipmentMapper the beer order shipment mapper
     * @return the updated beer order
     */
    default BeerOrder addShipments(BeerOrder beerOrder, BeerOrderDto beerOrderDto, BeerOrderShipmentMapper beerOrderShipmentMapper) {
        if (beerOrderDto.getShipments() != null && !beerOrderDto.getShipments().isEmpty()) {
            beerOrderDto.getShipments().forEach(shipmentDto -> {
                BeerOrderShipment shipment = beerOrderShipmentMapper.beerOrderShipmentDtoToBeerOrderShipment(shipmentDto);
                beerOrder.addShipment(shipment);
            });
        }
        return beerOrder;
    }
}
