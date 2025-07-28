package guru.springframework.juniemvc.service;

import guru.springframework.juniemvc.entities.Beer;
import guru.springframework.juniemvc.repositories.BeerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Implementation of the BeerService interface.
 */
@Service
public class BeerServiceImpl implements BeerService {

    private final BeerRepository beerRepository;

    /**
     * Constructor for dependency injection.
     * 
     * @param beerRepository The repository for Beer entities
     */
    public BeerServiceImpl(BeerRepository beerRepository) {
        this.beerRepository = beerRepository;
    }

    @Override
    public List<Beer> getAllBeers() {
        return beerRepository.findAll();
    }

    @Override
    public Optional<Beer> getBeerById(Integer id) {
        return beerRepository.findById(id);
    }

    @Override
    public Beer saveBeer(Beer beer) {
        return beerRepository.save(beer);
    }

    @Override
    public Optional<Beer> updateBeerById(Integer id, Beer beer) {
        return beerRepository.findById(id)
                .map(existingBeer -> {
                    existingBeer.setBeerName(beer.getBeerName());
                    existingBeer.setBeerStyle(beer.getBeerStyle());
                    existingBeer.setUpc(beer.getUpc());
                    existingBeer.setQuantityOnHand(beer.getQuantityOnHand());
                    existingBeer.setPrice(beer.getPrice());
                    return beerRepository.save(existingBeer);
                });
    }

    @Override
    public boolean deleteBeerById(Integer id) {
        if (beerRepository.existsById(id)) {
            beerRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
