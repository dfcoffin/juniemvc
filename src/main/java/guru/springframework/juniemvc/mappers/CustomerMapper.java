package guru.springframework.juniemvc.mappers;

import guru.springframework.juniemvc.entities.Customer;
import guru.springframework.juniemvc.models.CustomerDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * Mapper for Customer entity and CustomerDto
 */
@Mapper
public interface CustomerMapper {

    @Mapping(target = "beerOrders", ignore = true)
    CustomerDto customerToCustomerDto(Customer customer);

    @Mapping(target = "beerOrders", ignore = true)
    Customer customerDtoToCustomer(CustomerDto customerDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updateDate", ignore = true)
    @Mapping(target = "beerOrders", ignore = true)
    void updateCustomerFromDto(CustomerDto customerDto, @MappingTarget Customer customer);
}
