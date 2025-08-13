package guru.springframework.juniemvc.controllers;

import guru.springframework.juniemvc.models.BeerDto;
import guru.springframework.juniemvc.services.BeerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Beer operations
 */
@RestController
@RequestMapping("/api/v1/beers")
public class BeerController {

    private final BeerService beerService;

    public BeerController(BeerService beerService) {
        this.beerService = beerService;
    }

    /**
     * Get all beers
     * @return List of all beers
     */
    @GetMapping
    public List<BeerDto> getAllBeers() {
        return beerService.getAllBeers();
    }

    /**
     * Get a beer by its ID
     * @param id the beer ID
     * @return ResponseEntity with the beer if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<BeerDto> getBeerById(@PathVariable Integer id) {
        Optional<BeerDto> beerOptional = beerService.getBeerById(id);

        return beerOptional
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new beer
     * @param beerDto the beer to create
     * @return ResponseEntity with the created beer and 201 Created status
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BeerDto createBeer(@Valid @RequestBody BeerDto beerDto) {
        // Ensure a new beer is created, not an update
        beerDto.setId(null);
        return beerService.saveBeer(beerDto);
    }

    /**
     * Update an existing beer
     * @param id the beer ID
     * @param beerDto the updated beer data
     * @return ResponseEntity with the updated beer if found, or 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<BeerDto> updateBeer(@PathVariable Integer id, @Valid @RequestBody BeerDto beerDto) {
        Optional<BeerDto> beerOptional = beerService.getBeerById(id);

        if (beerOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Ensure we're updating the correct beer
        beerDto.setId(id);
        BeerDto updatedBeer = beerService.saveBeer(beerDto);
        return ResponseEntity.ok(updatedBeer);
    }

    /**
     * Delete a beer by its ID
     * @param id the beer ID
     * @return ResponseEntity with no content if successful, or 404 Not Found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeer(@PathVariable Integer id) {
        Optional<BeerDto> beerOptional = beerService.getBeerById(id);

        if (beerOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        beerService.deleteBeerById(id);
        return ResponseEntity.noContent().build();
    }
}
