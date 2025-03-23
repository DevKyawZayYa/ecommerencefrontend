import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { ProductsComponent } from './products/products.component';
import { inject } from '@angular/core';
import { Router } from 'express';
import { AuthGuard } from './guard/auth.guard';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component')
              .then(m => m.DashboardComponent) ,
              canActivate: [AuthGuard] 

            },
            {
                path: 'products',
                component: ProductsComponent,
                canActivate: [AuthGuard] 
            },
            {
                path: 'customers',
                component: CustomerComponent,
                canActivate: [AuthGuard] 
            },
        ]
    }
];
