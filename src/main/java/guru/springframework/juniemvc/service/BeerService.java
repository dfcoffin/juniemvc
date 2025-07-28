package guru.springframework.juniemvc.service;

import guru.springframework.juniemvc.entities.Beer;

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
    List<Beer> getAllBeers();
    
    /**
     * Get a beer by its ID.
     * 
     * @param id The ID of the beer to retrieve
     * @return Optional containing the beer if found, empty otherwise
     */
    Optional<Beer> getBeerById(Integer id);
    
    /**
     * Save a beer.
     * 
     * @param beer The beer to save
     * @return The saved beer with updated ID
     */
    Beer saveBeer(Beer beer);
}