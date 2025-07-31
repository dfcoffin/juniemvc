package guru.springframework.juniemvc.models;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO for customer information.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDto {

    // read only
    private Integer id;
    private Integer version;

    @NotBlank(message = "Name is required")
    @Size(max = 255)
    private String name;
    
    @Email(message = "Email must be valid")
    private String email;
    
    private String phoneNumber;
    
    @NotBlank(message = "Address line 1 is required")
    @Size(max = 255)
    private String addressLine1;
    
    private String addressLine2;
    
    @NotBlank(message = "City is required")
    @Size(max = 255)
    private String city;
    
    @NotBlank(message = "State is required")
    @Size(max = 255)
    private String state;
    
    @NotBlank(message = "Zip code is required")
    @Size(max = 255)
    private String zipCode;
    
    // read only created date
    private LocalDateTime createDate;
    
    // read only updated date
    private LocalDateTime updateDate;
}