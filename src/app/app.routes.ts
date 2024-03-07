import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { ProfileComponent } from './profile/profile.component';
import { CartItemsComponent } from './cart/cart-items/cart-items.component';
import { CheckoutComponent } from './cart/checkout/checkout.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { RecoverComponent } from './auth/recover/recover.component';
import { authGuard } from './auth.guard';
import { OrderReviewComponent } from './cart/order-review/order-review.component';
import { AddressComponent } from './profile/address/address.component';
import { OrderComponent } from './profile/order/order.component';
import { ReviewComponent } from './profile/review/review.component';
import { WishlistComponent } from './profile/wishlist/wishlist.component';
import { AccountComponent } from './profile/account/account.component';
import { ProductReviewComponent } from './product/product-review/product-review.component';
import { ProductReviewRepliesComponent } from './product/product-review-replies/product-review-replies.component';

export const routes: Routes = [
  { path: 'login', component: SignInComponent },
  { path: 'register', component: SignUpComponent },
  { path: 'recover', component: RecoverComponent },
  { path: 'home', component: HomeComponent },
  { path: 'all-products', component: ProductComponent },
  { path: 'product-list/:type', component: ProductComponent },
  { path: 'search/:keyword', component: ProductComponent },
  {
    path: 'product/:id',
    component: ProductDetailComponent,
    children: [{ path: '', component: ProductReviewComponent }],
  },

  {
    path: 'cart',
    component: CartComponent,
    children: [
      { path: '', component: CartItemsComponent },
      {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [authGuard],
      },
      { path: 'review/:orderId', component: OrderReviewComponent },
    ],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: AccountComponent },
      { path: 'addressList', component: AddressComponent },
      { path: 'orders', component: OrderComponent },
      { path: 'reviews', component: ReviewComponent },
      { path: 'wishlist', component: WishlistComponent },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
