import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Product } from '../model/product/product';
import { Page } from '../model/product/page';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiBaseUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiBaseUrl).pipe(
      map((data) =>
        data.map((p) => ({
          ...p,
          variants: new Map(Object.entries(p.variants)),
          colors: new Map(Object.entries(p.colors)),
        }))
      )
      // tap((data) => console.log(data.length))
    );
  }

  getProductsByType(
    type: string,
    pageNumber: number,
    pageSize: number,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc',
    brands?: string[]
  ): Observable<Page> {
    let params = new HttpParams().set('page', pageNumber).set('size', pageSize);
    // ?page=${pageNumber}&size=${pageSize}
    if (sortBy) {
      params = params.append('sort', `${sortBy},${sortOrder}`);
    }
    if (brands && brands.length) {
      params = params.set('brands', JSON.stringify(brands));
    }

    return this.http.get<Page>(`${this.apiBaseUrl}/${type}`, { params }).pipe(
      map((data) => ({
        ...data,
        products: data.products.map((p) => ({
          ...p,
          variants: new Map(Object.entries(p.variants)),
          colors: new Map(Object.entries(p.colors)),
        })),
      }))
    );
  }

  getProductById(id: number) {
    return this.http.get<Product>(`${this.apiBaseUrl}/product/${id}`).pipe(
      map((p) => ({
        ...p,
        variants: new Map(Object.entries(p.variants)),
        colors: new Map(Object.entries(p.colors)),
      }))
      // tap((data) => console.log(data))
    );
  }

  getBrands() {
    return this.http
      .get<Record<string, string[]>>(`${this.apiBaseUrl}/meta/type/brands/data`)
      .pipe(map((data) => new Map(Object.entries(data))));
  }
}
