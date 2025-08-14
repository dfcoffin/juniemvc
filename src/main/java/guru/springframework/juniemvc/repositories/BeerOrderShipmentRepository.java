package guru.springframework.juniemvc.repositories;

import guru.springframework.juniemvc.entities.BeerOrderShipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository for BeerOrderShipment entity
 */
public interface BeerOrderShipmentRepository extends JpaRepository<BeerOrderShipment, Integer> {

    /**
     * Find shipments by beer order id
     * @param beerOrderId the beer order id
     * @return the list of shipments
     */
    List<BeerOrderShipment> findByBeerOrderId(Integer beerOrderId);
}