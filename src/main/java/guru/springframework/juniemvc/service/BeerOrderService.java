package guru.springframework.juniemvc.service;

import guru.springframework.juniemvc.models.BeerOrderDto;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for beer order operations.
 */
public interface BeerOrderService {
    /**
     * Get all beer orders.
     * 
     * @return List of all beer orders
     */
    List<BeerOrderDto> getAllBeerOrders();

    /**
     * Get a beer order by its ID.
     * 
     * @param id The ID of the beer order to retrieve
     * @return Optional containing the beer order if found, empty otherwise
     */
    Optional<BeerOrderDto> getBeerOrderById(Integer id);

    /**
     * Save a beer order.
     * 
     * @param beerOrderDto The beer order to save
     * @return The saved beer order with updated ID
     */
    BeerOrderDto saveBeerOrder(BeerOrderDto beerOrderDto);

    /**
     * Update an existing beer order.
     * 
     * @param id The ID of the beer order to update
     * @param beerOrderDto The updated beer order data
     * @return Optional containing the updated beer order if found and updated, empty otherwise
     */
    Optional<BeerOrderDto> updateBeerOrderById(Integer id, BeerOrderDto beerOrderDto);

    /**
     * Delete a beer order by its ID.
     * 
     * @param id The ID of the beer order to delete
     * @return true if the beer order was found and deleted, false otherwise
     */
    boolean deleteBeerOrderById(Integer id);
}