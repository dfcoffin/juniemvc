package guru.springframework.juniemvc.mappers;

import guru.springframework.juniemvc.entities.Beer;
import guru.springframework.juniemvc.entities.BeerOrderLine;
import guru.springframework.juniemvc.entities.OrderLineStatus;
import guru.springframework.juniemvc.models.BeerOrderLineDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class BeerOrderLineMapperTests {

    private BeerOrderLineMapper beerOrderLineMapper;
    private BeerOrderLine beerOrderLine;
    private BeerOrderLineDto beerOrderLineDto;
    private Beer beer;

    @BeforeEach
    void setUp() {
        // Get the mapper instance
        beerOrderLineMapper = Mappers.getMapper(BeerOrderLineMapper.class);

        // Create a test Beer entity
        beer = Beer.builder()
                .beerName("Test Beer")
                .beerStyle("IPA")
                .upc("1234567890123")
                .quantityOnHand(100)
                .price(new BigDecimal("12.99"))
                .build();
        beer.setId(1);

        // Create a test BeerOrderLine entity
        beerOrderLine = BeerOrderLine.builder()
                .beer(beer)
                .orderQuantity(10)
                .quantityAllocated(5)
                .lineStatus(OrderLineStatus.NEW)
                .build();
        beerOrderLine.setId(1);

        // Create a test BeerOrderLineDto
//        beerOrderLineDto = BeerOrderLineDto.builder()
//                .beerId(2)
//                .beerName("Test Beer DTO")
//                .beerStyle("Stout")
//                .upc("9876543210123")
//                .price(new BigDecimal("9.99"))
//                .orderQuantity(20)
//                .quantityAllocated(10)
//                .lineStatus(OrderLineStatus.ALLOCATED)
//                .build();
//        beerOrderLineDto.setId(2);
    }

    @Test
    void testBeerOrderLineToBeerOrderLineDto() {
        // Convert BeerOrderLine to BeerOrderLineDto
        BeerOrderLineDto beerOrderLineDto = beerOrderLineMapper.beerOrderLineToBeerOrderLineDto(beerOrderLine);

        // Verify the conversion
        assertThat(beerOrderLineDto).isNotNull();
        assertThat(beerOrderLineDto.getId()).isEqualTo(beerOrderLine.getId());
        assertThat(beerOrderLineDto.getBeerId()).isEqualTo(beer.getId());
        assertThat(beerOrderLineDto.getBeerName()).isEqualTo(beer.getBeerName());
        assertThat(beerOrderLineDto.getBeerStyle()).isEqualTo(beer.getBeerStyle());
        assertThat(beerOrderLineDto.getUpc()).isEqualTo(beer.getUpc());
        assertThat(beerOrderLineDto.getPrice()).isEqualTo(beer.getPrice());
        assertThat(beerOrderLineDto.getOrderQuantity()).isEqualTo(beerOrderLine.getOrderQuantity());
        assertThat(beerOrderLineDto.getQuantityAllocated()).isEqualTo(beerOrderLine.getQuantityAllocated());
        assertThat(beerOrderLineDto.getLineStatus()).isEqualTo(beerOrderLine.getLineStatus());
    }

    @Test
    void testBeerOrderLineDtoToBeerOrderLine() {
        // Given
        BeerOrderLineDto beerOrderLineDto = BeerOrderLineDto.builder()
                .id(2)
                .beerId(1)
                .beerName("Test Beer")
                .beerStyle("IPA")
                .upc("123456")
                .orderQuantity(3)
                .quantityAllocated(0)
                .lineStatus(OrderLineStatus.valueOf("NEW"))
                .build();

        // When
        // Convert BeerOrderLineDto to BeerOrderLine
        BeerOrderLine beerOrderLine = beerOrderLineMapper.beerOrderLineDtoToBeerOrderLine(beerOrderLineDto);

        // Verify the conversion
        assertThat(beerOrderLine).isNotNull();
        // ID is mapped from DTO to entity, beer should be ignored in the mapping
        assertThat(beerOrderLine.getId()).isEqualTo(beerOrderLineDto.getId());
        assertThat(beerOrderLine.getBeer()).isNull();
        assertThat(beerOrderLine.getOrderQuantity()).isEqualTo(beerOrderLineDto.getOrderQuantity());
        assertThat(beerOrderLine.getQuantityAllocated()).isEqualTo(beerOrderLineDto.getQuantityAllocated());
        assertThat(beerOrderLine.getLineStatus()).isEqualTo(beerOrderLineDto.getLineStatus());
    }

    @Test
    void testNullBeerOrderLine() {
        // Test null handling
        BeerOrderLineDto dto = beerOrderLineMapper.beerOrderLineToBeerOrderLineDto(null);
        assertThat(dto).isNull();
    }

    @Test
    void testNullBeerOrderLineDto() {
        // Test null handling
        BeerOrderLine entity = beerOrderLineMapper.beerOrderLineDtoToBeerOrderLine(null);
        assertThat(entity).isNull();
    }
}
