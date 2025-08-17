import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen, waitFor} from '../test/test-utils';
import BeerFormPage from '../pages/beers/BeerFormPage';
import {BeerService} from '../services/beerService';
import {BeerStyle} from '../types/beer';
import {MemoryRouter, Route, Routes} from 'react-router-dom';

// Mock the BeerService
vi.mock('../services/beerService', () => ({
  BeerService: {
    createBeer: vi.fn(),
    uploadBeerImage: vi.fn()
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

describe('Beer Form Submission Integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock successful beer creation
    vi.mocked(BeerService.createBeer).mockResolvedValue({
      id: '123',
      beerName: 'Test Beer',
      beerStyle: BeerStyle.IPA,
      upc: '123456789012',
      price: 9.99,
      quantityOnHand: 100
    });
    
    // Mock successful image upload
    vi.mocked(BeerService.uploadBeerImage).mockResolvedValue({
      id: '123',
      beerName: 'Test Beer',
      beerStyle: BeerStyle.IPA,
      upc: '123456789012',
      price: 9.99,
      quantityOnHand: 100,
      imageUrl: 'http://example.com/test-beer.jpg'
    });
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('successfully submits a new beer form', async () => {
    // Render the form
    render(
      <MemoryRouter initialEntries={['/beers/new']}>
        <Routes>
          <Route path="/beers/new" element={<BeerFormPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Fill out the form
    const beerNameInput = screen.getByLabelText(/beer name/i);
    const upcInput = screen.getByLabelText(/upc/i);
    const priceInput = screen.getByLabelText(/price/i);
    const quantityInput = screen.getByLabelText(/quantity on hand/i);
    const styleSelect = screen.getByLabelText(/beer style/i);
    
    fireEvent.change(beerNameInput, { target: { value: 'Test Beer' } });
    fireEvent.change(upcInput, { target: { value: '123456789012' } });
    fireEvent.change(priceInput, { target: { value: '9.99' } });
    fireEvent.change(quantityInput, { target: { value: '100' } });
    fireEvent.change(styleSelect, { target: { value: BeerStyle.IPA } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create beer/i });
    fireEvent.click(submitButton);
    
    // Check that the service was called with the right data
    await waitFor(() => {
      expect(BeerService.createBeer).toHaveBeenCalledWith({
        beerName: 'Test Beer',
        beerStyle: BeerStyle.IPA,
        upc: '123456789012',
        price: 9.99,
        quantityOnHand: 100,
      });
    });
    
    // Check that we navigated to the beer detail page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/beers/123');
    });
  });
  
  it('shows validation errors for invalid form data', async () => {
    // Render the form
    render(
      <MemoryRouter initialEntries={['/beers/new']}>
        <Routes>
          <Route path="/beers/new" element={<BeerFormPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Submit without filling out required fields
    const submitButton = screen.getByRole('button', { name: /create beer/i });
    fireEvent.click(submitButton);
    
    // Check that validation errors are shown
    await waitFor(() => {
      expect(screen.getByText(/beer name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/upc is required/i)).toBeInTheDocument();
    });
    
    // Service should not have been called
    expect(BeerService.createBeer).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  
  it('handles API errors during submission', async () => {
    // Mock API error
    vi.mocked(BeerService.createBeer).mockRejectedValue(new Error('API Error'));
    
    // Render the form
    render(
      <MemoryRouter initialEntries={['/beers/new']}>
        <Routes>
          <Route path="/beers/new" element={<BeerFormPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Fill out the form
    const beerNameInput = screen.getByLabelText(/beer name/i);
    const upcInput = screen.getByLabelText(/upc/i);
    const priceInput = screen.getByLabelText(/price/i);
    const styleSelect = screen.getByLabelText(/beer style/i);
    
    fireEvent.change(beerNameInput, { target: { value: 'Test Beer' } });
    fireEvent.change(upcInput, { target: { value: '123456789012' } });
    fireEvent.change(priceInput, { target: { value: '9.99' } });
    fireEvent.change(styleSelect, { target: { value: BeerStyle.IPA } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create beer/i });
    fireEvent.click(submitButton);
    
    // Check that the service was called
    await waitFor(() => {
      expect(BeerService.createBeer).toHaveBeenCalled();
    });
    
    // We should not navigate
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});