import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Address } from '../../model/address';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css',
})
export class AddressComponent implements OnInit {
  addresses: Address[] = [];
  addressForm: FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService) {
    this.addressForm = this.fb.group({
      house: new FormControl(''),
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
      zipcode: new FormControl(''),
      landmark: new FormControl(''),
      addressType: new FormControl(''),
      directions: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.userService
      .getAddresses()
      .subscribe((data) => (this.addresses = data));
  }

  submitForm() {
    const data = this.addressForm.value;
    const address: Address = {
      ...data,
    };

    this.userService.addAddress(address);
  }
}
