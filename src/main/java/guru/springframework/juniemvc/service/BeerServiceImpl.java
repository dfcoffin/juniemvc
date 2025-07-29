package guru.springframework.juniemvc.service;

import guru.springframework.juniemvc.entities.Beer;
import guru.springframework.juniemvc.mappers.BeerMapper;
import guru.springframework.juniemvc.models.BeerDto;
import guru.springframework.juniemvc.repositories.BeerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of the BeerService interface.
 */
@Service
public class BeerServiceImpl implements BeerService {

    private final BeerRepository beerRepository;
    private final BeerMapper beerMapper;

    /**
     * Constructor for dependency injection.
     * 
     * @param beerRepository The repository for Beer entities
     * @param beerMapper The mapper for converting between Beer entities and DTOs
     */
    public BeerServiceImpl(BeerRepository beerRepository, BeerMapper beerMapper) {
        this.beerRepository = beerRepository;
        this.beerMapper = beerMapper;
    }

    @Override
    public List<BeerDto> getAllBeers() {
        return beerRepository.findAll().stream()
                .map(beerMapper::beerToBeerDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<BeerDto> getBeerById(Integer id) {
        return beerRepository.findById(id)
                .map(beerMapper::beerToBeerDto);
    }

    @Override
    public BeerDto saveBeer(BeerDto beerDto) {
        Beer beer = beerMapper.beerDtoToBeer(beerDto);
        Beer savedBeer = beerRepository.save(beer);
        return beerMapper.beerToBeerDto(savedBeer);
    }

    @Override
    public Optional<BeerDto> updateBeerById(Integer id, BeerDto beerDto) {
        return beerRepository.findById(id)
                .map(existingBeer -> {
                    existingBeer.setBeerName(beerDto.getBeerName());
                    existingBeer.setBeerStyle(beerDto.getBeerStyle());
                    existingBeer.setUpc(beerDto.getUpc());
                    existingBeer.setQuantityOnHand(beerDto.getQuantityOnHand());
                    existingBeer.setPrice(beerDto.getPrice());
                    return beerRepository.save(existingBeer);
                })
                .map(beerMapper::beerToBeerDto);
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
