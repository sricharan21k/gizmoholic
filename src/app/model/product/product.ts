export interface Product {
  id: number;
  type: string;
  brand: string;
  model: string;
  description: string;
  specs: string[];
  variants: Map<string, number>;
  colors: Map<string, string>;
}
