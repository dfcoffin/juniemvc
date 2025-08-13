package guru.springframework.juniemvc.exceptions;

/**
 * Exception thrown when there is an error related to beer orders
 */
public class BeerOrderException extends RuntimeException {
    
    public BeerOrderException() {
        super();
    }
    
    public BeerOrderException(String message) {
        super(message);
    }
    
    public BeerOrderException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public BeerOrderException(Throwable cause) {
        super(cause);
    }
}