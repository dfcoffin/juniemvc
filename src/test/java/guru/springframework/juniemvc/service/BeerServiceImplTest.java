package guru.springframework.juniemvc.service;

import guru.springframework.juniemvc.entities.Beer;
import guru.springframework.juniemvc.mappers.BeerMapper;
import guru.springframework.juniemvc.models.BeerDto;
import guru.springframework.juniemvc.repositories.BeerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BeerServiceImplTest {

    @Mock
    BeerRepository beerRepository;

    @Mock
    BeerMapper beerMapper;

    @InjectMocks
    BeerServiceImpl beerService;

    Beer testBeer;
    BeerDto testBeerDto;

    @BeforeEach
    void setUp() {
        testBeer = Beer.builder()
                .beerName("Test Beer")
                .beerStyle("IPA")
                .upc("123456789012")
                .quantityOnHand(100)
                .price(new BigDecimal("12.99"))
                .build();
        testBeer.setId(1);
        testBeer.setVersion(1);

        testBeerDto = BeerDto.builder()
                .id(1)
                .version(1)
                .beerName("Test Beer")
                .beerStyle("IPA")
                .upc("123456789012")
                .quantityOnHand(100)
                .price(new BigDecimal("12.99"))
                .build();
    }

    @Test
    void getAllBeers() {
        // given
        List<Beer> expectedBeers = Arrays.asList(testBeer);
        when(beerRepository.findAll()).thenReturn(expectedBeers);
        when(beerMapper.beerToBeerDto(testBeer)).thenReturn(testBeerDto);

        // when
        List<BeerDto> actualBeers = beerService.getAllBeers();

        // then
        assertThat(actualBeers).hasSize(1);
        assertThat(actualBeers.get(0)).isEqualTo(testBeerDto);
        verify(beerRepository).findAll();
        verify(beerMapper).beerToBeerDto(testBeer);
    }

    @Test
    void getBeerById() {
        // given
        when(beerRepository.findById(1)).thenReturn(Optional.of(testBeer));
        when(beerMapper.beerToBeerDto(testBeer)).thenReturn(testBeerDto);

        // when
        Optional<BeerDto> foundBeer = beerService.getBeerById(1);

        // then
        assertThat(foundBeer).isPresent();
        assertThat(foundBeer.get()).isEqualTo(testBeerDto);
        verify(beerRepository).findById(1);
        verify(beerMapper).beerToBeerDto(testBeer);
    }

    @Test
    void getBeerByIdNotFound() {
        // given
        when(beerRepository.findById(999)).thenReturn(Optional.empty());

        // when
        Optional<BeerDto> foundBeer = beerService.getBeerById(999);

        // then
        assertThat(foundBeer).isEmpty();
        verify(beerRepository).findById(999);
    }

    @Test
    void saveBeer() {
        // given
        BeerDto beerDtoToSave = BeerDto.builder()
                .beerName("New Beer")
                .beerStyle("Lager")
                .upc("123456789012")
                .quantityOnHand(50)
                .price(new BigDecimal("9.99"))
                .build();

        Beer beerToSave = Beer.builder()
                .beerName("New Beer")
                .beerStyle("Lager")
                .upc("123456789012")
                .quantityOnHand(50)
                .price(new BigDecimal("9.99"))
                .build();

        Beer savedBeer = Beer.builder()
                .beerName("New Beer")
                .beerStyle("Lager")
                .upc("123456789012")
                .quantityOnHand(50)
                .price(new BigDecimal("9.99"))
                .build();
        savedBeer.setId(2);
        savedBeer.setVersion(1);

        BeerDto savedBeerDto = BeerDto.builder()
                .id(2)
                .version(1)
                .beerName("New Beer")
                .beerStyle("Lager")
                .upc("123456789012")
                .quantityOnHand(50)
                .price(new BigDecimal("9.99"))
                .build();

        when(beerMapper.beerDtoToBeer(beerDtoToSave)).thenReturn(beerToSave);
        when(beerRepository.save(beerToSave)).thenReturn(savedBeer);
        when(beerMapper.beerToBeerDto(savedBeer)).thenReturn(savedBeerDto);

        // when
        BeerDto result = beerService.saveBeer(beerDtoToSave);

        // then
        assertThat(result).isEqualTo(savedBeerDto);
        verify(beerMapper).beerDtoToBeer(beerDtoToSave);
        verify(beerRepository).save(beerToSave);
        verify(beerMapper).beerToBeerDto(savedBeer);
    }

    @Test
    void updateBeerById() {
        // given
        BeerDto beerDtoToUpdate = BeerDto.builder()
                .beerName("Updated Beer")
                .beerStyle("Stout")
                .upc("123456789012")
                .quantityOnHand(75)
                .price(new BigDecimal("14.99"))
                .build();

        Beer existingBeer = Beer.builder()
                .beerName("Test Beer")
                .beerStyle("IPA")
                .upc("123456789012")
                .quantityOnHand(100)
                .price(new BigDecimal("12.99"))
                .build();
        existingBeer.setId(1);
        existingBeer.setVersion(1);

        Beer updatedBeer = Beer.builder()
                .beerName("Updated Beer")
                .beerStyle("Stout")
                .upc("123456789012")
                .quantityOnHand(75)
                .price(new BigDecimal("14.99"))
                .build();
        updatedBeer.setId(1);
        updatedBeer.setVersion(1);

        BeerDto updatedBeerDto = BeerDto.builder()
                .id(1)
                .version(1)
                .beerName("Updated Beer")
                .beerStyle("Stout")
                .upc("123456789012")
                .quantityOnHand(75)
                .price(new BigDecimal("14.99"))
                .build();

        given(beerRepository.findById(1)).willReturn(Optional.of(existingBeer));
        given(beerRepository.save(any(Beer.class))).willReturn(updatedBeer);
        given(beerMapper.beerToBeerDto(updatedBeer)).willReturn(updatedBeerDto);

        // when
        Optional<BeerDto> result = beerService.updateBeerById(1, beerDtoToUpdate);

        // then
        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(updatedBeerDto);
        verify(beerRepository).findById(1);
        verify(beerRepository).save(any(Beer.class));
        verify(beerMapper).beerToBeerDto(updatedBeer);
    }

    @Test
    void updateBeerByIdNotFound() {
        // given
        BeerDto beerDtoToUpdate = BeerDto.builder()
                .beerName("Updated Beer")
                .beerStyle("Stout")
                .upc("123456789012")
                .quantityOnHand(75)
                .price(new BigDecimal("14.99"))
                .build();

        given(beerRepository.findById(999)).willReturn(Optional.empty());

        // when
        Optional<BeerDto> result = beerService.updateBeerById(999, beerDtoToUpdate);

        // then
        assertThat(result).isEmpty();
        verify(beerRepository).findById(999);
    }

    @Test
    void deleteBeerById() {
        // given
        given(beerRepository.existsById(1)).willReturn(true);

        // when
        boolean result = beerService.deleteBeerById(1);

        // then
        assertThat(result).isTrue();
        verify(beerRepository).existsById(1);
        verify(beerRepository).deleteById(1);
    }

    @Test
    void deleteBeerByIdNotFound() {
        // given
        given(beerRepository.existsById(999)).willReturn(false);

        // when
        boolean result = beerService.deleteBeerById(999);

        // then
        assertThat(result).isFalse();
        verify(beerRepository).existsById(999);
    }
}
