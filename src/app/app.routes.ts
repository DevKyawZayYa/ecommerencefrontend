import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { AuthGuard } from './guard/auth.guard';
import { PaymentCancelComponent } from './pages/payment-cancel/payment-cancel.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterComponent } from './pages/register/register.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
          canActivate: [AuthGuard],

      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/products.component').then(
            (m) => m.ProductsComponent
          ),
          canActivate: [AuthGuard],

      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./pages/cart/cart.component').then((m) => m.CartComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./pages/checkout/checkout.component').then((m) => m.CheckoutComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'payment-success',
        component: PaymentSuccessComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'payment-cancel',
        component: PaymentCancelComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'account/profile',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/customer/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'account/addresses',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./pages/customer/addresses/addresses.component').then(m => m.AddressesComponent)
      },        
      {
        path: 'account/my-purchase',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./pages/order/order-list/order-list.component').then(m => m.OrderListComponent)
      },
      {
        path: 'account/order-detail/:orderId',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./pages/order/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
      },
      {
        path: 'product/:id',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./pages/product-detail/product-detail.component').then(
            (m) => m.ProductDetailComponent
          ),
      },  
      {
        path: 'account/password',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/change-password/change-password.component').then(m => m.ChangePasswordComponent)
      }
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];
