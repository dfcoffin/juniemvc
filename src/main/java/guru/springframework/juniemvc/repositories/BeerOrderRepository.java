package guru.springframework.juniemvc.repositories;

import guru.springframework.juniemvc.entities.BeerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for BeerOrder entity
 */
public interface BeerOrderRepository extends JpaRepository<BeerOrder, Integer> {
    // Spring Data JPA will implement basic CRUD operations
    // Custom query methods can be added here if needed
}