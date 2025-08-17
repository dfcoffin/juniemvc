/**
 * Beer types definitions
 */

/**
 * Beer style enumeration
 */
export enum BeerStyle {
  LAGER = 'LAGER',
  PILSNER = 'PILSNER',
  STOUT = 'STOUT',
  GOSE = 'GOSE',
  PORTER = 'PORTER',
  ALE = 'ALE',
  WHEAT = 'WHEAT',
  IPA = 'IPA',
  PALE_ALE = 'PALE_ALE',
  SAISON = 'SAISON'
}

/**
 * Beer interface representing a beer entity
 */
export interface Beer {
  id?: string;
  version?: number;
  beerName: string;
  beerStyle: BeerStyle;
  upc: string;
  price: number;
  quantityOnHand?: number;
  imageUrl?: string;
  createdDate?: string;
  updatedDate?: string;
}

/**
 * Beer page interface for paginated responses
 */
export interface BeerPage {
  content: Beer[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

/**
 * Beer DTO for creating/updating beers
 */
export interface BeerDto {
  beerName: string;
  beerStyle: BeerStyle;
  upc: string;
  price: number;
  quantityOnHand?: number;
  image?: File;
}

/**
 * Beer patch DTO for partially updating beer properties
 */
export interface BeerPatchDto {
  beerName?: string;
  beerStyle?: BeerStyle;
  upc?: string;
  price?: number;
  quantityOnHand?: number;
  image?: File;
}