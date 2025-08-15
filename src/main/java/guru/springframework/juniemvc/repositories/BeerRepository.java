package guru.springframework.juniemvc.repositories;

import guru.springframework.juniemvc.entities.Beer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for Beer entity
 */
public interface BeerRepository extends JpaRepository<Beer, Integer> {
    // Spring Data JPA will implement basic CRUD operations

    /**
     * Find all beers with optional filtering by beer name
     * @param beerName the beer name to filter by (can be null)
     * @param pageable pagination information
     * @return Page of beers matching the criteria
     */
    Page<Beer> findAllByBeerNameContainingIgnoreCase(String beerName, Pageable pageable);

    /**
     * Find all beers with optional filtering by beer name and beer style
     * @param beerName the beer name to filter by (can be null)
     * @param beerStyle the beer style to filter by (can be null)
     * @param pageable pagination information
     * @return Page of beers matching the criteria
     */
    Page<Beer> findAllByBeerNameContainingIgnoreCaseAndBeerStyleContainingIgnoreCase(
            String beerName, String beerStyle, Pageable pageable);
}
