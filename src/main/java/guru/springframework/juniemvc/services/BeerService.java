package guru.springframework.juniemvc.services;

import guru.springframework.juniemvc.models.BeerDto;
import guru.springframework.juniemvc.models.BeerPatchDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
     * Get all beers with optional filtering by beer name and beer style, with pagination
     * @param beerName the beer name to filter by (can be null)
     * @param beerStyle the beer style to filter by (can be null)
     * @param pageable pagination information
     * @return Page of beers matching the criteria
     */
    Page<BeerDto> getAllBeers(String beerName, String beerStyle, Pageable pageable);

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
     * Partially update an existing beer
     * @param id the beer ID
     * @param beerPatchDto the beer patch data
     * @return Optional containing the updated beer if found
     */
    Optional<BeerDto> patchBeer(Integer id, BeerPatchDto beerPatchDto);

    /**
     * Delete a beer by its ID
     * @param id the beer ID
     */
    void deleteBeerById(Integer id);
}
