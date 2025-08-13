package guru.springframework.juniemvc.repositories;

import guru.springframework.juniemvc.entities.BeerOrderLine;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for BeerOrderLine entity
 */
public interface BeerOrderLineRepository extends JpaRepository<BeerOrderLine, Integer> {
    // Spring Data JPA will implement basic CRUD operations
    // Custom query methods can be added here if needed
}