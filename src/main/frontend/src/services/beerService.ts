import {apiService} from '../api/axiosConfig';
import {Beer, BeerDto, BeerPage, BeerPatchDto, BeerStyle} from '../types/beer';

/**
 * Beer service for handling beer-related API operations
 */
export const BeerService = {
  /**
   * Upload an image for a beer
   * @param id - The beer ID
   * @param file - The image file to upload
   * @returns Promise with the updated beer including image URL
   */
  uploadBeerImage: (id: string, file: File): Promise<Beer> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiService.post<Beer>(`/api/v1/beer/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  /**
   * Get a paginated list of beers with optional filtering
   * @param pageNumber - The page number to retrieve
   * @param pageSize - The number of items per page
   * @param beerName - Optional beer name filter
   * @param beerStyle - Optional beer style filter
   * @param showInventory - Whether to include inventory data
   * @returns Promise with paginated beer data
   */
  getBeers: (
    pageNumber: number = 0,
    pageSize: number = 25,
    beerName?: string,
    beerStyle?: BeerStyle,
    showInventory: boolean = false
  ): Promise<BeerPage> => {
    const params: Record<string, any> = {
      pageNumber,
      pageSize,
      showInventory,
    };

    if (beerName) params.beerName = beerName;
    if (beerStyle) params.beerStyle = beerStyle;

    return apiService.get<BeerPage>('/api/v1/beer', { params });
  },

  /**
   * Get a beer by its ID
   * @param id - The beer ID
   * @returns Promise with beer data
   */
  getBeerById: (id: string): Promise<Beer> => {
    return apiService.get<Beer>(`/api/v1/beer/${id}`);
  },

  /**
   * Create a new beer
   * @param beerDto - The beer data to create
   * @returns Promise with the created beer
   */
  createBeer: (beerDto: BeerDto): Promise<Beer> => {
    return apiService.post<Beer>('/api/v1/beer', beerDto);
  },

  /**
   * Update a beer
   * @param id - The beer ID
   * @param beerDto - The updated beer data
   * @returns Promise with the updated beer
   */
  updateBeer: (id: string, beerDto: BeerDto): Promise<Beer> => {
    return apiService.put<Beer>(`/api/v1/beer/${id}`, beerDto);
  },

  /**
   * Partially update a beer
   * @param id - The beer ID
   * @param beerPatchDto - The partial beer data to update
   * @returns Promise with the updated beer
   */
  patchBeer: (id: string, beerPatchDto: BeerPatchDto): Promise<Beer> => {
    return apiService.patch<Beer>(`/api/v1/beer/${id}`, beerPatchDto);
  },

  /**
   * Delete a beer
   * @param id - The beer ID
   * @returns Promise with void
   */
  deleteBeer: (id: string): Promise<void> => {
    return apiService.delete<void>(`/api/v1/beer/${id}`);
  },
};

export default BeerService;