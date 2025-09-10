import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './main/home/home.component';
import {AuthGuard} from './auth/helpers';
import { InstructorProfileComponent } from './instructor-profile/instructor-profile.component';
import { UpdateProfileComponent } from './instructor-profile/update-profile/update-profile.component';
import { UpdatePasswordComponent } from './instructor-profile/update-profile/update-password/update-password.component';
import { LivesessionComponent } from './app/main/apps/livesession/livesession.component';
import { JoinLiveSessionComponent } from './app/main/apps/livesession/join-live-session/join-live-session.component';
import { AnalyticsComponent } from './main/dashboard/admin-analytics/analytics.component';
import { BrokerUserComponent } from './main/users/broker/broker-user/broker-user.component';
import { NewbrokerUserComponent } from './main/users/broker/newbroker-user/newbroker-user.component';
import { BrokerUserinfoComponent } from './main/users/broker/broker-userinfo/broker-userinfo.component';
import { LiveroomComponent } from './app/main/apps/livesession/liveroom/liveroom.component';

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
        path: 'dashboard/profile',
        component: InstructorProfileComponent 
    },
    {
        path: 'update-profile',
        component: UpdateProfileComponent 
    },
    {
        path: 'update-password',
        component: UpdatePasswordComponent 
    },
    {
        path: 'livesession',
        component: LivesessionComponent 
    },
    {
        path: 'joinlivesession',
        component: JoinLiveSessionComponent 
    },
    {
        path: 'room/:roomId',
        component: LiveroomComponent
    },
    {
        path: 'user-broker',
        component: BrokerUserComponent 
    },
    {
        path: 'newuser-broker',
        component: NewbrokerUserComponent 
    },
    {
        path: 'userinfo-broker/:id',
        component: BrokerUserinfoComponent 
    },
    // {
    //     path: 'analysis',
    //     component: AnalyticsComponent 
    // },
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
