import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { ProductsComponent } from './products/products.component';
import { inject } from '@angular/core';
import { Router } from 'express';


const authGuard = () => {
    const token = localStorage.getItem('accessToken');
    const router = inject(Router);

    if(!token) {
        router.navigate(['/login']);
        return false;
    }

    return true;
};

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
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'products',
                component: ProductsComponent
            },
            {
                path: 'customers',
                component: CustomerComponent
            },
        ]
    }
    
];
