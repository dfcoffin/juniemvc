package guru.springframework.juniemvc.controllers;

import guru.springframework.juniemvc.entities.Beer;
import guru.springframework.juniemvc.service.BeerService;
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
    public List<Beer> getAllBeers() {
        return beerService.getAllBeers();
    }

    /**
     * Get a beer by its ID.
     * 
     * @param id The ID of the beer to retrieve
     * @return ResponseEntity containing the beer if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Beer> getBeerById(@PathVariable Integer id) {
        Optional<Beer> beerOptional = beerService.getBeerById(id);

        return beerOptional
                .map(beer -> new ResponseEntity<>(beer, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Create a new beer.
     * 
     * @param beer The beer to create
     * @return The created beer with status 201 Created
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Beer createBeer(@RequestBody Beer beer) {
        return beerService.saveBeer(beer);
    }

    /**
     * Update an existing beer.
     * 
     * @param id The ID of the beer to update
     * @param beer The updated beer data
     * @return ResponseEntity containing the updated beer if found and updated, or 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Beer> updateBeer(@PathVariable Integer id, @RequestBody Beer beer) {
        Optional<Beer> updatedBeerOptional = beerService.updateBeerById(id, beer);

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
