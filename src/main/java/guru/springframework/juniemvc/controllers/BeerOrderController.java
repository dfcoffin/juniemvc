package guru.springframework.juniemvc.controllers;

import guru.springframework.juniemvc.models.BeerOrderDto;
import guru.springframework.juniemvc.services.BeerOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for BeerOrder operations
 */
@RestController
@RequestMapping("/api/v1/beer-orders")
public class BeerOrderController {

    private final BeerOrderService beerOrderService;

    public BeerOrderController(BeerOrderService beerOrderService) {
        this.beerOrderService = beerOrderService;
    }

    /**
     * Get all beer orders
     * @return List of all beer orders
     */
    @GetMapping
    public List<BeerOrderDto> getAllBeerOrders() {
        return beerOrderService.getAllBeerOrders();
    }

    /**
     * Get a beer order by its ID
     * @param id the beer order ID
     * @return ResponseEntity with the beer order if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<BeerOrderDto> getBeerOrderById(@PathVariable Integer id) {
        Optional<BeerOrderDto> beerOrderOptional = beerOrderService.getBeerOrderById(id);

        return beerOrderOptional
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new beer order
     * @param beerOrderDto the beer order to create
     * @return ResponseEntity with the created beer order and 201 Created status
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BeerOrderDto createBeerOrder(@Valid @RequestBody BeerOrderDto beerOrderDto) {
        // Ensure a new beer order is created, not an update
        beerOrderDto.setId(null);
        return beerOrderService.saveBeerOrder(beerOrderDto);
    }

    /**
     * Update an existing beer order
     * @param id the beer order ID
     * @param beerOrderDto the updated beer order data
     * @return ResponseEntity with the updated beer order if found, or 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<BeerOrderDto> updateBeerOrder(@PathVariable Integer id, @Valid @RequestBody BeerOrderDto beerOrderDto) {
        Optional<BeerOrderDto> beerOrderOptional = beerOrderService.getBeerOrderById(id);

        if (beerOrderOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Ensure we're updating the correct beer order
        beerOrderDto.setId(id);
        BeerOrderDto updatedBeerOrder = beerOrderService.saveBeerOrder(beerOrderDto);
        return ResponseEntity.ok(updatedBeerOrder);
    }

    /**
     * Delete a beer order by its ID
     * @param id the beer order ID
     * @return ResponseEntity with no content if successful, or 404 Not Found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeerOrder(@PathVariable Integer id) {
        Optional<BeerOrderDto> beerOrderOptional = beerOrderService.getBeerOrderById(id);

        if (beerOrderOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        beerOrderService.deleteBeerOrderById(id);
        return ResponseEntity.noContent().build();
    }
}