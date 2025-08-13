package guru.springframework.juniemvc.services;

import guru.springframework.juniemvc.models.BeerDto;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Beer operations
 */
public interface BeerService {

    /**
     * Get all beers
     * @return List of all beers
     */
    List<BeerDto> getAllBeers();

    /**
     * Get a beer by its ID
     * @param id the beer ID
     * @return Optional containing the beer if found
     */
    Optional<BeerDto> getBeerById(Integer id);

    /**
     * Save a new beer or update an existing one
     * @param beerDto the beer to save
     * @return the saved beer
     */
    BeerDto saveBeer(BeerDto beerDto);

    /**
     * Delete a beer by its ID
     * @param id the beer ID
     */
    void deleteBeerById(Integer id);
}
