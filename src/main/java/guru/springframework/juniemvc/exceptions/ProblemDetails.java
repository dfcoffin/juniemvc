package guru.springframework.juniemvc.exceptions;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.net.URI;
import java.util.Map;

/**
 * Problem Details for HTTP APIs (RFC 9457)
 * @see <a href="https://www.rfc-editor.org/rfc/rfc9457.html">RFC 9457</a>
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProblemDetails {
    
    /**
     * A URI reference that identifies the problem type
     */
    private URI type;
    
    /**
     * A short, human-readable summary of the problem type
     */
    private String title;
    
    /**
     * The HTTP status code
     */
    private int status;
    
    /**
     * A human-readable explanation specific to this occurrence of the problem
     */
    private String detail;
    
    /**
     * A URI reference that identifies the specific occurrence of the problem
     */
    private URI instance;
    
    /**
     * Additional information about the problem
     */
    private Map<String, Object> extensions;
}