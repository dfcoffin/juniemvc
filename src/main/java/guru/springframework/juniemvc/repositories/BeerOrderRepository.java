package guru.springframework.juniemvc.repositories;

import guru.springframework.juniemvc.entities.BeerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for BeerOrder entities.
 */
@Repository
public interface BeerOrderRepository extends JpaRepository<BeerOrder, Integer> {
    // Spring Data JPA will automatically implement CRUD operations
    // Custom query methods can be added as needed
}