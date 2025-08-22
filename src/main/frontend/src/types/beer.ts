/**
 * Beer types definitions
 */

import type {Page} from "./common";

/**
 * Beer style enumeration
 */
export enum BeerStyle {
  LAGER = "LAGER",
  PILSNER = "PILSNER",
  STOUT = "STOUT",
  GOSE = "GOSE",
  PORTER = "PORTER",
  ALE = "ALE",
  WHEAT = "WHEAT",
  IPA = "IPA",
  PALE_ALE = "PALE_ALE",
  SAISON = "SAISON",
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
export type BeerPage = Page<Beer>;

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
