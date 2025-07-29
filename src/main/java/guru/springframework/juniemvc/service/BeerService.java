package guru.springframework.juniemvc.service;

import guru.springframework.juniemvc.models.BeerDto;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Beer operations.
 */
public interface BeerService {

    /**
     * Get all beers.
     * 
     * @return List of all beers
     */
    List<BeerDto> getAllBeers();

    /**
     * Get a beer by its ID.
     * 
     * @param id The ID of the beer to retrieve
     * @return Optional containing the beer if found, empty otherwise
     */
    Optional<BeerDto> getBeerById(Integer id);

    /**
     * Save a beer.
     * 
     * @param beerDto The beer to save
     * @return The saved beer with updated ID
     */
    BeerDto saveBeer(BeerDto beerDto);

    /**
     * Update an existing beer.
     * 
     * @param id The ID of the beer to update
     * @param beerDto The updated beer data
     * @return Optional containing the updated beer if found and updated, empty otherwise
     */
    Optional<BeerDto> updateBeerById(Integer id, BeerDto beerDto);

    /**
     * Delete a beer by its ID.
     * 
     * @param id The ID of the beer to delete
     * @return true if the beer was found and deleted, false otherwise
     */
    boolean deleteBeerById(Integer id);
}
