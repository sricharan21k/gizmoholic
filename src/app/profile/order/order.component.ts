import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Order } from '../../model/order/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.userService.getOrders().subscribe((data) => (this.orders = data));
  }
}
