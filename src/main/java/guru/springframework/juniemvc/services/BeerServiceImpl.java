package guru.springframework.juniemvc.services;

import guru.springframework.juniemvc.entities.Beer;
import guru.springframework.juniemvc.mappers.BeerMapper;
import guru.springframework.juniemvc.models.BeerDto;
import guru.springframework.juniemvc.repositories.BeerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of BeerService that uses BeerRepository for persistence
 */
@Service
public class BeerServiceImpl implements BeerService {

    private final BeerRepository beerRepository;
    private final BeerMapper beerMapper;

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
    public Page<BeerDto> getAllBeers(String beerName, String beerStyle, Pageable pageable) {
        // Handle different combinations of parameters
        boolean hasName = StringUtils.hasText(beerName);
        boolean hasStyle = StringUtils.hasText(beerStyle);

        Page<Beer> beerPage;

        if (hasName && hasStyle) {
            // Both parameters provided
            beerPage = beerRepository.findAllByBeerNameContainingIgnoreCaseAndBeerStyleContainingIgnoreCase(
                    beerName, beerStyle, pageable);
        } else if (hasName) {
            // Only beerName provided
            beerPage = beerRepository.findAllByBeerNameContainingIgnoreCase(beerName, pageable);
        } else if (hasStyle) {
            // Only beerStyle provided - use the combined method with empty string for name
            beerPage = beerRepository.findAllByBeerNameContainingIgnoreCaseAndBeerStyleContainingIgnoreCase(
                    "", beerStyle, pageable);
        } else {
            // No parameters provided - use the combined method with empty strings
            beerPage = beerRepository.findAllByBeerNameContainingIgnoreCaseAndBeerStyleContainingIgnoreCase(
                    "", "", pageable);
        }

        return beerPage.map(beerMapper::beerToBeerDto);
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
    public void deleteBeerById(Integer id) {
        beerRepository.deleteById(id);
    }
}
