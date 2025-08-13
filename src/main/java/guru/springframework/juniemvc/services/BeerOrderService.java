package guru.springframework.juniemvc.services;

import guru.springframework.juniemvc.models.BeerOrderDto;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for BeerOrder operations
 */
public interface BeerOrderService {

    /**
     * Get all beer orders
     * @return List of all beer orders
     */
    List<BeerOrderDto> getAllBeerOrders();

    /**
     * Get a beer order by its ID
     * @param id the beer order ID
     * @return Optional containing the beer order if found
     */
    Optional<BeerOrderDto> getBeerOrderById(Integer id);

    /**
     * Save a new beer order or update an existing one
     * @param beerOrderDto the beer order to save
     * @return the saved beer order
     */
    BeerOrderDto saveBeerOrder(BeerOrderDto beerOrderDto);

    /**
     * Delete a beer order by its ID
     * @param id the beer order ID
     */
    void deleteBeerOrderById(Integer id);
}