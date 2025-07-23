import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './main/home/home.component';
import {AuthGuard} from './auth/helpers';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent // Ensure you have a HomeComponent
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'pages',
        loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
    },
    {
        path: 'apps',
        loadChildren: () => import('./main/apps/apps.module').then(m => m.AppsModule)
    },
    {
        path: 'users',
        loadChildren: () => import('./main/users/users.module').then(m => m.UsersModule)
    },
    {
        path: '**',
        loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
        // redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollPositionRestoration: 'enabled', // Add options right here
        relativeLinkResolution: 'legacy'
    })],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
