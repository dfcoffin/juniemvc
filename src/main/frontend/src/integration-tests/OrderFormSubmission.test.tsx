import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen, waitFor} from '../test/test-utils';
import OrderFormPage from '../pages/orders/OrderFormPage';
import {BeerOrderService} from '../services/beerOrderService';
import {BeerService} from '../services/beerService';
import {CustomerService} from '../services/customerService';
import {BeerOrderStatus} from '../types/beerOrder';
import {mockBeerPage, mockCustomerPage, mockCustomers} from '../test/mocks/api-mocks';
import {MemoryRouter, Route, Routes} from 'react-router-dom';

// Mock the services
vi.mock('../services/beerOrderService', () => ({
  BeerOrderService: {
    createBeerOrder: vi.fn()
  }
}));

vi.mock('../services/beerService', () => ({
  BeerService: {
    getBeers: vi.fn()
  }
}));

vi.mock('../services/customerService', () => ({
  CustomerService: {
    getCustomers: vi.fn()
  }
}));

// Mock router navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Order Form Submission Integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock successful API responses
    vi.mocked(BeerService.getBeers).mockResolvedValue(mockBeerPage);
    vi.mocked(CustomerService.getCustomers).mockResolvedValue(mockCustomerPage);
    vi.mocked(BeerOrderService.createBeerOrder).mockResolvedValue({
      id: 123,
      customerRef: 'John Doe',
      paymentAmount: 25.98,
      status: BeerOrderStatus.NEW,
      beerOrderLines: [
        {
          beerId: 1,
          beerName: 'Galaxy Cat',
          beerStyle: 'PALE_ALE',
          upc: '123456789012',
          orderQuantity: 2,
          quantityAllocated: 0
        }
      ]
    });
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('successfully loads customers and beers', async () => {
    // Render the form
    render(
      <MemoryRouter initialEntries={['/orders/new']}>
        <Routes>
          <Route path="/orders/new" element={<OrderFormPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Verify customer and beer data is loaded
    await waitFor(() => {
      expect(CustomerService.getCustomers).toHaveBeenCalled();
      expect(BeerService.getBeers).toHaveBeenCalled();
    });
    
    // Verify customer dropdown is populated
    const customerSelect = screen.getByLabelText(/select customer/i);
    await waitFor(() => {
      // +1 for the default "Select a customer..." option
      expect(customerSelect.querySelectorAll('option').length).toBe(mockCustomers.length + 1);
    });
  });
  
  it('successfully submits a new order', async () => {
    // Render the form
    render(
      <MemoryRouter initialEntries={['/orders/new']}>
        <Routes>
          <Route path="/orders/new" element={<OrderFormPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(CustomerService.getCustomers).toHaveBeenCalled();
      expect(BeerService.getBeers).toHaveBeenCalled();
    });
    
    // Fill out the customer section
    const customerSelect = screen.getByLabelText(/select customer/i);
    fireEvent.change(customerSelect, { target: { value: '1' } });
    
    // Verify customer reference is updated
    const customerRefInput = screen.getByLabelText(/customer reference/i);
    await waitFor(() => {
      expect(customerRefInput).toHaveValue('John Doe');
    });
    
    // Add a beer to the order
    const beerSelect = screen.getByLabelText(/beer/i);
    const quantityInput = screen.getByLabelText(/quantity$/i);
    const addButton = screen.getByRole('button', { name: /add to order/i });
    
    fireEvent.change(beerSelect, { target: { value: '1' } });
    fireEvent.change(quantityInput, { target: { value: '2' } });
    fireEvent.click(addButton);
    
    // Verify beer was added to the order
    await waitFor(() => {
      expect(screen.getByText(/galaxy cat/i)).toBeInTheDocument();
    });
    
    // Submit the order
    const submitButton = screen.getByRole('button', { name: /create order/i });
    fireEvent.click(submitButton);
    
    // Verify order creation was called
    await waitFor(() => {
      expect(BeerOrderService.createBeerOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          customerRef: 'John Doe',
          beerOrderLines: expect.arrayContaining([
            expect.objectContaining({
              beerId: 1,
              orderQuantity: 2
            })
          ])
        })
      );
    });
    
    // Verify navigation to order detail page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/orders/123');
    });
  });
  
  it('shows validation errors when submitting without required fields', async () => {
    // Render the form
    render(
      <MemoryRouter initialEntries={['/orders/new']}>
        <Routes>
          <Route path="/orders/new" element={<OrderFormPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /create order/i });
    expect(submitButton).toBeDisabled(); // Button should be disabled initially
    
    // Select customer but don't add line items
    const customerSelect = screen.getByLabelText(/select customer/i);
    fireEvent.change(customerSelect, { target: { value: '1' } });
    
    // Submit should still be prevented
    await waitFor(() => {
      expect(screen.getByText(/no items added to this order yet/i)).toBeInTheDocument();
    });
    
    // Service should not have been called
    expect(BeerOrderService.createBeerOrder).not.toHaveBeenCalled();
  });
  
  it('handles API errors during submission', async () => {
    // Mock API error
    vi.mocked(BeerOrderService.createBeerOrder).mockRejectedValue(new Error('API Error'));
    
    // Render the form
    render(
      <MemoryRouter initialEntries={['/orders/new']}>
        <Routes>
          <Route path="/orders/new" element={<OrderFormPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(CustomerService.getCustomers).toHaveBeenCalled();
      expect(BeerService.getBeers).toHaveBeenCalled();
    });
    
    // Fill out the form
    const customerSelect = screen.getByLabelText(/select customer/i);
    fireEvent.change(customerSelect, { target: { value: '1' } });
    
    // Add a beer to the order
    const beerSelect = screen.getByLabelText(/beer/i);
    const quantityInput = screen.getByLabelText(/quantity$/i);
    const addButton = screen.getByRole('button', { name: /add to order/i });
    
    fireEvent.change(beerSelect, { target: { value: '1' } });
    fireEvent.change(quantityInput, { target: { value: '2' } });
    fireEvent.click(addButton);
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create order/i });
    fireEvent.click(submitButton);
    
    // Verify service was called but we don't navigate
    await waitFor(() => {
      expect(BeerOrderService.createBeerOrder).toHaveBeenCalled();
    });
    
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});