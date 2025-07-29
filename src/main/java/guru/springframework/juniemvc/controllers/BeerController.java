package guru.springframework.juniemvc.controllers;

import guru.springframework.juniemvc.models.BeerDto;
import guru.springframework.juniemvc.service.BeerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Beer operations.
 */
@RestController
@RequestMapping(path = "/api/v1/beer", produces = MediaType.APPLICATION_JSON_VALUE)
public class BeerController {

    private final BeerService beerService;

    /**
     * Constructor for dependency injection.
     * 
     * @param beerService The service for Beer operations
     */
    public BeerController(BeerService beerService) {
        this.beerService = beerService;
    }

    /**
     * Get all beers.
     * 
     * @return List of all beers
     */
    @GetMapping
    public List<BeerDto> getAllBeers() {
        return beerService.getAllBeers();
    }

    /**
     * Get a beer by its ID.
     * 
     * @param id The ID of the beer to retrieve
     * @return ResponseEntity containing the beer if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<BeerDto> getBeerById(@PathVariable Integer id) {
        Optional<BeerDto> beerOptional = beerService.getBeerById(id);

        return beerOptional
                .map(beer -> new ResponseEntity<>(beer, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Create a new beer.
     * 
     * @param beerDto The beer to create
     * @return The created beer with status 201 Created
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BeerDto createBeer(@Valid @RequestBody BeerDto beerDto) {
        return beerService.saveBeer(beerDto);
    }

    /**
     * Update an existing beer.
     * 
     * @param id The ID of the beer to update
     * @param beerDto The updated beer data
     * @return ResponseEntity containing the updated beer if found and updated, or 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<BeerDto> updateBeer(@PathVariable Integer id, @Valid @RequestBody BeerDto beerDto) {
        Optional<BeerDto> updatedBeerOptional = beerService.updateBeerById(id, beerDto);

        return updatedBeerOptional
                .map(updatedBeer -> new ResponseEntity<>(updatedBeer, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Delete a beer by its ID.
     * 
     * @param id The ID of the beer to delete
     * @return ResponseEntity with 204 No Content if deleted, or 404 Not Found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeer(@PathVariable Integer id) {
        boolean deleted = beerService.deleteBeerById(id);

        return deleted ? 
                new ResponseEntity<>(HttpStatus.NO_CONTENT) : 
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
