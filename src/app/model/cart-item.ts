import { Product } from './product/product';

export interface CartItem {
  id: number;
  item: Product;
  color: string;
  variant: string;
  quantity: number;
  itemValue: number;
}
