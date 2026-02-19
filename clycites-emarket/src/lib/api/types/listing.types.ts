import type { Product, PaginationParams } from "./shared.types";

export type ListingStatus = "active" | "sold" | "expired" | "draft";

export interface ListingLocation {
  region: string;
  district?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Listing {
  id: string;
  farmer: string | {
    id: string;
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    isVerified?: boolean;
  };
  product: Product;
  quantity: number;
  unit?: string;
  price: number;
  currency: string;
  status: ListingStatus;
  harvestDate?: string;
  expiryDate?: string;
  location: ListingLocation;
  images: string[];
  description?: string;
  grade?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ListingCreateRequest {
  product: string;
  quantity: number;
  price: number;
  currency?: string;
  harvestDate?: string;
  expiryDate?: string;
  location?: { region: string; district?: string };
  description?: string;
  grade?: string;
  images?: string[];
}

export type ListingUpdateRequest = Partial<ListingCreateRequest> & {
  status?: ListingStatus;
};

export interface ListingFilters extends PaginationParams {
  search?: string;
  product?: string;
  category?: string;
  grade?: string;
  minPrice?: number;
  maxPrice?: number;
  region?: string;
  district?: string;
  status?: ListingStatus;
  sort?: "newest" | "price_asc" | "price_desc" | "distance";
  currency?: string;
}
