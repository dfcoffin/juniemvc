import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {BeerService} from '../beerService';
import {apiService} from '../../api/axiosConfig';
import {BeerStyle} from '../../types/beer';
import {mockBeerPage, mockBeers} from '../../test/mocks/api-mocks';

// Mock the axios-based API service
vi.mock('../../api/axiosConfig', () => ({
  apiService: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('BeerService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getBeers', () => {
    it('fetches beers with default parameters', async () => {
      // Setup
      vi.mocked(apiService.get).mockResolvedValue(mockBeerPage);

      // Execute
      const result = await BeerService.getBeers();

      // Verify
      expect(apiService.get).toHaveBeenCalledWith('/api/v1/beer', {
        params: {
          pageNumber: 0,
          pageSize: 25,
          showInventory: false
        }
      });
      expect(result).toEqual(mockBeerPage);
    });

    it('fetches beers with custom parameters', async () => {
      // Setup
      vi.mocked(apiService.get).mockResolvedValue(mockBeerPage);
      const params = {
        pageNumber: 1,
        pageSize: 10,
        beerName: 'Test Beer',
        beerStyle: BeerStyle.IPA,
        showInventory: true
      };

      // Execute
      const result = await BeerService.getBeers(
        params.pageNumber,
        params.pageSize,
        params.beerName,
        params.beerStyle,
        params.showInventory
      );

      // Verify
      expect(apiService.get).toHaveBeenCalledWith('/api/v1/beer', {
        params: {
          pageNumber: 1,
          pageSize: 10,
          beerName: 'Test Beer',
          beerStyle: BeerStyle.IPA,
          showInventory: true
        }
      });
      expect(result).toEqual(mockBeerPage);
    });

    it('handles API errors', async () => {
      // Setup
      const errorMessage = 'Network Error';
      vi.mocked(apiService.get).mockRejectedValue(new Error(errorMessage));

      // Execute and verify
      await expect(BeerService.getBeers()).rejects.toThrow(errorMessage);
    });
  });

  describe('getBeerById', () => {
    it('fetches a beer by ID', async () => {
      // Setup
      const beer = mockBeers[0];
      vi.mocked(apiService.get).mockResolvedValue(beer);

      // Execute
      const result = await BeerService.getBeerById('1');

      // Verify
      expect(apiService.get).toHaveBeenCalledWith('/api/v1/beer/1');
      expect(result).toEqual(beer);
    });

    it('handles API errors', async () => {
      // Setup
      const errorMessage = 'Beer not found';
      vi.mocked(apiService.get).mockRejectedValue(new Error(errorMessage));

      // Execute and verify
      await expect(BeerService.getBeerById('999')).rejects.toThrow(errorMessage);
    });
  });

  describe('createBeer', () => {
    it('creates a new beer', async () => {
      // Setup
      const newBeer = {
        beerName: 'New Test Beer',
        beerStyle: BeerStyle.LAGER,
        upc: '123456789012',
        price: 9.99,
        quantityOnHand: 100
      };
      const createdBeer = { ...newBeer, id: '3' };
      vi.mocked(apiService.post).mockResolvedValue(createdBeer);

      // Execute
      const result = await BeerService.createBeer(newBeer);

      // Verify
      expect(apiService.post).toHaveBeenCalledWith('/api/v1/beer', newBeer);
      expect(result).toEqual(createdBeer);
    });
  });

  describe('uploadBeerImage', () => {
    it('uploads an image for a beer', async () => {
      // Setup
      const beerId = '1';
      const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
      const updatedBeer = { ...mockBeers[0], imageUrl: 'http://example.com/image.png' };
      vi.mocked(apiService.post).mockResolvedValue(updatedBeer);

      // Execute
      const result = await BeerService.uploadBeerImage(beerId, file);

      // Verify
      expect(apiService.post).toHaveBeenCalledWith(
        '/api/v1/beer/1/image',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      );
      expect(result).toEqual(updatedBeer);
    });
  });

  describe('updateBeer', () => {
    it('updates an existing beer', async () => {
      // Setup
      const beerId = '1';
      const beerToUpdate = {
        beerName: 'Updated Beer',
        beerStyle: BeerStyle.STOUT,
        upc: '123456789012',
        price: 12.99,
        quantityOnHand: 200
      };
      const updatedBeer = { ...beerToUpdate, id: beerId };
      vi.mocked(apiService.put).mockResolvedValue(updatedBeer);

      // Execute
      const result = await BeerService.updateBeer(beerId, beerToUpdate);

      // Verify
      expect(apiService.put).toHaveBeenCalledWith(`/api/v1/beer/${beerId}`, beerToUpdate);
      expect(result).toEqual(updatedBeer);
    });
  });

  describe('patchBeer', () => {
    it('partially updates a beer', async () => {
      // Setup
      const beerId = '1';
      const patchData = {
        price: 14.99,
        quantityOnHand: 150
      };
      const patchedBeer = { ...mockBeers[0], ...patchData };
      vi.mocked(apiService.patch).mockResolvedValue(patchedBeer);

      // Execute
      const result = await BeerService.patchBeer(beerId, patchData);

      // Verify
      expect(apiService.patch).toHaveBeenCalledWith(`/api/v1/beer/${beerId}`, patchData);
      expect(result).toEqual(patchedBeer);
    });
  });

  describe('deleteBeer', () => {
    it('deletes a beer', async () => {
      // Setup
      const beerId = '1';
      vi.mocked(apiService.delete).mockResolvedValue(undefined);

      // Execute
      await BeerService.deleteBeer(beerId);

      // Verify
      expect(apiService.delete).toHaveBeenCalledWith(`/api/v1/beer/${beerId}`);
    });
  });
});