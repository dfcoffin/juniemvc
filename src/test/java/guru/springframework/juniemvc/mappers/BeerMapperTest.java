package guru.springframework.juniemvc.mappers;

import guru.springframework.juniemvc.entities.Beer;
import guru.springframework.juniemvc.models.BeerDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class BeerMapperTest {

    private BeerMapper beerMapper;
    private Beer beer;
    private BeerDto beerDto;

    @BeforeEach
    void setUp() {
        // Get the mapper instance
        beerMapper = Mappers.getMapper(BeerMapper.class);

        // Create a test Beer entity
        beer = Beer.builder()
                .beerName("Test Beer")
                .beerStyle("IPA")
                .upc("1234567890123")
                .quantityOnHand(100)
                .price(new BigDecimal("12.99"))
                .build();
        beer.setId(1);

        // Create a test BeerDto
        beerDto = BeerDto.builder()
                .beerName("Test Beer DTO")
                .beerStyle("Stout")
                .upc("9876543210123")
                .quantityOnHand(50)
                .price(new BigDecimal("9.99"))
                .build();
        beerDto.setId(2);
    }

    @Test
    void testBeerToBeerDto() {
        // Convert Beer to BeerDto
        BeerDto dto = beerMapper.beerToBeerDto(beer);

        // Verify the conversion
        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(beer.getId());
        assertThat(dto.getBeerName()).isEqualTo(beer.getBeerName());
        assertThat(dto.getBeerStyle()).isEqualTo(beer.getBeerStyle());
        assertThat(dto.getUpc()).isEqualTo(beer.getUpc());
        assertThat(dto.getQuantityOnHand()).isEqualTo(beer.getQuantityOnHand());
        assertThat(dto.getPrice()).isEqualTo(beer.getPrice());
    }

    @Test
    void testBeerDtoToBeer() {
        // Convert BeerDto to Beer
        Beer entity = beerMapper.beerDtoToBeer(beerDto);

        // Verify the conversion
        assertThat(entity).isNotNull();
        assertThat(entity.getBeerName()).isEqualTo(beerDto.getBeerName());
        assertThat(entity.getBeerStyle()).isEqualTo(beerDto.getBeerStyle());
        assertThat(entity.getUpc()).isEqualTo(beerDto.getUpc());
        assertThat(entity.getQuantityOnHand()).isEqualTo(beerDto.getQuantityOnHand());
        assertThat(entity.getPrice()).isEqualTo(beerDto.getPrice());
        // beerOrderLines should be ignored in the mapping
        assertThat(entity.getBeerOrderLines()).isNotNull();
        assertThat(entity.getBeerOrderLines()).isEmpty();
    }

    @Test
    void testNullBeer() {
        // Test null handling
        BeerDto dto = beerMapper.beerToBeerDto(null);
        assertThat(dto).isNull();
    }

    @Test
    void testNullBeerDto() {
        // Test null handling
        Beer entity = beerMapper.beerDtoToBeer(null);
        assertThat(entity).isNull();
    }
}
