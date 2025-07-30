package guru.springframework.juniemvc.repositories;

import guru.springframework.juniemvc.entities.BeerOrderLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for BeerOrderLine entities.
 */
@Repository
public interface BeerOrderLineRepository extends JpaRepository<BeerOrderLine, Integer> {
    /**
     * Find beer order lines by beer order ID.
     *
     * @param beerOrderId The ID of the beer order
     * @return List of beer order lines for the specified beer order
     */
    List<BeerOrderLine> findByBeerOrderId(Integer beerOrderId);
}