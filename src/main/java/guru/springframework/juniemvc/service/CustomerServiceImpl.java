package guru.springframework.juniemvc.service;

import guru.springframework.juniemvc.entities.Customer;
import guru.springframework.juniemvc.mappers.CustomerMapper;
import guru.springframework.juniemvc.models.CustomerDto;
import guru.springframework.juniemvc.repositories.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of the CustomerService interface.
 */
@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    /**
     * Constructor for dependency injection.
     * 
     * @param customerRepository The repository for Customer entities
     * @param customerMapper The mapper for converting between Customer entities and DTOs
     */
    public CustomerServiceImpl(CustomerRepository customerRepository, CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customerMapper::customerToCustomerDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CustomerDto> getCustomerById(Integer id) {
        return customerRepository.findById(id)
                .map(customerMapper::customerToCustomerDto);
    }

    @Override
    @Transactional
    public CustomerDto saveCustomer(CustomerDto customerDto) {
        Customer customer = customerMapper.customerDtoToCustomer(customerDto);
        Customer savedCustomer = customerRepository.save(customer);
        return customerMapper.customerToCustomerDto(savedCustomer);
    }

    @Override
    @Transactional
    public Optional<CustomerDto> updateCustomerById(Integer id, CustomerDto customerDto) {
        return customerRepository.findById(id)
                .map(existingCustomer -> {
                    existingCustomer.setName(customerDto.getName());
                    existingCustomer.setEmail(customerDto.getEmail());
                    existingCustomer.setPhoneNumber(customerDto.getPhoneNumber());
                    existingCustomer.setAddressLine1(customerDto.getAddressLine1());
                    existingCustomer.setAddressLine2(customerDto.getAddressLine2());
                    existingCustomer.setCity(customerDto.getCity());
                    existingCustomer.setState(customerDto.getState());
                    existingCustomer.setZipCode(customerDto.getZipCode());
                    return customerRepository.save(existingCustomer);
                })
                .map(customerMapper::customerToCustomerDto);
    }

    @Override
    @Transactional
    public boolean deleteCustomerById(Integer id) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            return true;
        }
        return false;
    }
}