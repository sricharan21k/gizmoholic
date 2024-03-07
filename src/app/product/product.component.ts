import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../model/product/product';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { CartItem } from '../model/cart-item';
import { Page } from '../model/product/page';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  brands: string[] = [];
  page?: Page;
  currentPage: number = 0;
  pageSize: number = 10;
  type: string = '';
  sortBy: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  // allBrandsSelected: boolean = true;
  selectedBrands: string[] = [];
  // selectedBrands: { [key: string]: boolean } = {};
  // selectedProducts: Product[] = [];
  colorImages: { [key: number]: [string, string] } = {};
  variantPrices: { [key: number]: [string, number] } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRed: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const type = params.get('type') as string;
      const search = params.get('keyword') as string;

      if (type) {
        this.type = type;
        this.productService.getBrands().subscribe((data) => {
          this.brands = data.get(this.type) ?? [];
          // this.brands.forEach((brand) => (this.selectedBrands[brand] = true));
          this.selectedBrands = this.brands;
          console.log(this.selectedBrands);
        });
        this.productService
          .getProductsByType(type, 0, this.pageSize)
          .subscribe((data) => {
            this.page = data;
            this.products = data.products;
            // this.selectedProducts = data.products;
            this.initializeDefaults(data.products);
          });
      } else if (search) {
        const word = search.toLowerCase();
        this.productService.getAllProducts().subscribe((data) => {
          this.products = data.filter(
            (x) =>
              x.brand.toLowerCase().includes(word) ||
              x.model.toLowerCase().includes(word) ||
              x.type.toLowerCase().includes(word)
          );
          this.initializeDefaults(data);
        });
      }
    });
  }

  addToCart(item: Product, color: string, variant: string) {
    const currentId = this.cartService.getCartItemId();
    let newId = currentId ? currentId + 1 : 1;
    const newCartItem: CartItem = {
      id: newId,
      item: item,
      color: color,
      variant: variant,
      quantity: 1,
      itemValue: item.variants.get(variant) as number,
    };
    this.cartService.addItemToCart(newCartItem);
  }

  buyNow(item: Product, color: string, variant: string) {
    this.addToCart(item, color, variant);
    this.router.navigate(['/cart']);
  }

  initializeDefaults(data: Product[]) {
    data.forEach((p) => {
      this.colorImages[p.id] = Array.from(p.colors.entries())[0];
      this.variantPrices[p.id] = Array.from(p.variants.entries())[0];
    });
  }

  updateDefaultColor(id: number, key: string, value: string) {
    this.colorImages[id][0] = key;
    this.colorImages[id][1] = value;
  }
  updateDefaultVariant(id: number, key: string, value: number) {
    this.variantPrices[id][0] = key;
    this.variantPrices[id][1] = value;
  }

  getPage(
    pageNumber: number,
    pageSize: number,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ) {
    this.currentPage = pageNumber;
    this.productService
      .getProductsByType(
        this.type,
        pageNumber,
        pageSize,
        sortBy,
        sortOrder,
        this.selectedBrands
      )
      .subscribe((data) => {
        this.page = data;
        this.products = data.products;

        this.initializeDefaults(data.products);
      });
  }

  jumpToPage(event: any) {
    const pageNumber = event.target.value;
    if (pageNumber) {
      this.getPage(pageNumber - 1, this.pageSize);
    }
  }

  getPageOfSize(event: any) {
    const size = event.target.dataset.value;
    if (size) {
      this.pageSize = size;
      this.getPage(this.currentPage, size);
    }
  }

  sort(sortBy: string, sortOrder: 'asc' | 'desc') {
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    this.getPage(this.currentPage, this.pageSize, sortBy, sortOrder);
  }

  getPageNumbers() {
    return this.page
      ? Array.from({ length: this.page?.totalPages }, (_, i) => i)
      : [];
  }

  SelectAllBrands() {
    if (this.allBrandsSelected()) {
      this.selectedBrands = [];
    } else {
      this.selectedBrands = this.brands;
      this.getPage(this.currentPage, this.pageSize);
    }
  }
  allBrandsSelected(): boolean {
    return this.selectedBrands.length === this.brands.length;
  }

  brandSelected(brand: string): boolean {
    return this.selectedBrands.some((b) => b === brand);
  }

  selectBrand(brand: string) {
    const updateBrands = this.selectedBrands.includes(brand)
      ? this.selectedBrands.filter((b) => b !== brand)
      : [...this.selectedBrands, brand];
    this.selectedBrands = updateBrands;
    this.getPage(0, this.pageSize);
  }

  toPascalCase(str: string): string {
    if (/^\d/.test(str)) {
      return str.toUpperCase();
    }
    const words = str.split(' ');
    const pascalCaseWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return pascalCaseWords.join(' ');
  }
}
