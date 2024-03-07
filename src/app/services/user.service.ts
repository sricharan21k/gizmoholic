import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from '../model/address';
import { Observable, tap } from 'rxjs';
import { Order } from '../model/order/order';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiBaseUrl = 'http://localhost:8080/users';
  constructor(private http: HttpClient) {}

  addAddress(address: Address) {
    this.http
      .patch<Address>(`${this.apiBaseUrl}/shree/address`, address)
      .subscribe((res) => console.log(res));
  }

  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiBaseUrl}/shree/address`);
  }

  placeOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiBaseUrl}/shree/order`, order);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiBaseUrl}/shree/orders`);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiBaseUrl}/shree/orders/${id}`);
    // .subscribe((res) => console.log(res));
  }
}
