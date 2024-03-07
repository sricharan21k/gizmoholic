import { Product } from './product';

export interface Page {
  products: Product[];
  totalProducts: number;
  totalPages: number;
}
