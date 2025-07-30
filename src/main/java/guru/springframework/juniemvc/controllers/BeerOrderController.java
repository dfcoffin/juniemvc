package guru.springframework.juniemvc.controllers;

import guru.springframework.juniemvc.models.BeerOrderDto;
import guru.springframework.juniemvc.service.BeerOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for beer order operations.
 */
@RestController
@RequestMapping(path = "/api/v1/beerorder", produces = MediaType.APPLICATION_JSON_VALUE)
public class BeerOrderController {

    private final BeerOrderService beerOrderService;

    /**
     * Constructor for dependency injection.
     *
     * @param beerOrderService Service for beer order operations
     */
    public BeerOrderController(BeerOrderService beerOrderService) {
        this.beerOrderService = beerOrderService;
    }

    /**
     * Get all beer orders.
     *
     * @return List of all beer orders
     */
    @GetMapping
    public List<BeerOrderDto> getAllBeerOrders() {
        return beerOrderService.getAllBeerOrders();
    }

    /**
     * Get a beer order by its ID.
     *
     * @param id The ID of the beer order to retrieve
     * @return ResponseEntity containing the beer order if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<BeerOrderDto> getBeerOrderById(@PathVariable Integer id) {
        Optional<BeerOrderDto> beerOrderOptional = beerOrderService.getBeerOrderById(id);

        return beerOrderOptional
                .map(order -> new ResponseEntity<>(order, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Create a new beer order.
     *
     * @param beerOrderDto The beer order to create
     * @return The created beer order with status 201 Created
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BeerOrderDto createBeerOrder(@Valid @RequestBody BeerOrderDto beerOrderDto) {
        return beerOrderService.saveBeerOrder(beerOrderDto);
    }

    /**
     * Update an existing beer order.
     *
     * @param id The ID of the beer order to update
     * @param beerOrderDto The updated beer order data
     * @return ResponseEntity containing the updated beer order if found and updated, or 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<BeerOrderDto> updateBeerOrder(@PathVariable Integer id, @Valid @RequestBody BeerOrderDto beerOrderDto) {
        Optional<BeerOrderDto> updatedBeerOrderOptional = beerOrderService.updateBeerOrderById(id, beerOrderDto);

        return updatedBeerOrderOptional
                .map(updatedOrder -> new ResponseEntity<>(updatedOrder, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Delete a beer order by its ID.
     *
     * @param id The ID of the beer order to delete
     * @return ResponseEntity with 204 No Content if deleted, or 404 Not Found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeerOrder(@PathVariable Integer id) {
        boolean deleted = beerOrderService.deleteBeerOrderById(id);

        return deleted ? 
                new ResponseEntity<>(HttpStatus.NO_CONTENT) : 
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}