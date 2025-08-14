package guru.springframework.juniemvc.services;

import guru.springframework.juniemvc.models.BeerOrderShipmentDto;

import java.util.List;

/**
 * Service for BeerOrderShipment operations
 */
public interface BeerOrderShipmentService {

    /**
     * Get all shipments for a beer order
     * @param beerOrderId the beer order id
     * @return the list of shipments
     */
    List<BeerOrderShipmentDto> getAllShipments(Integer beerOrderId);

    /**
     * Get a shipment by id
     * @param beerOrderId the beer order id
     * @param shipmentId the shipment id
     * @return the shipment
     */
    BeerOrderShipmentDto getShipmentById(Integer beerOrderId, Integer shipmentId);

    /**
     * Create a new shipment
     * @param beerOrderId the beer order id
     * @param shipmentDto the shipment DTO
     * @return the created shipment
     */
    BeerOrderShipmentDto createShipment(Integer beerOrderId, BeerOrderShipmentDto shipmentDto);

    /**
     * Update a shipment
     * @param beerOrderId the beer order id
     * @param shipmentId the shipment id
     * @param shipmentDto the shipment DTO
     * @return the updated shipment
     */
    BeerOrderShipmentDto updateShipment(Integer beerOrderId, Integer shipmentId, BeerOrderShipmentDto shipmentDto);

    /**
     * Delete a shipment
     * @param beerOrderId the beer order id
     * @param shipmentId the shipment id
     */
    void deleteShipment(Integer beerOrderId, Integer shipmentId);
}