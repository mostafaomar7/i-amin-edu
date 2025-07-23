import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {TranslateModule} from '@ngx-translate/core';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgApexchartsModule} from 'ng-apexcharts';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

import {AuthGuard} from 'app/auth/helpers';
import {Role} from 'app/auth/models';

import {CoreCommonModule} from '@core/common.module';


import {DashboardService} from 'app/main/dashboard/dashboard.service';

import {AnalyticsComponent} from 'app/main/dashboard/admin-analytics/analytics.component';
import {CourseModule} from '../apps/courses/course.module';
import {InstructorsModule} from '../users/instructors/instructors.module';
import {OrganizationModule} from '../users/organizations/organization.module';
import {OrgAnalyticsComponent} from './org-analytics/org-analytics.component';

const routes = [
    {
        path: '',
        component: AnalyticsComponent,
        canActivate: [AuthGuard],
        data: {roles: [Role.Student], animation: 'danalytics'},
        // resolve: {
        //   css: DashboardService,
        // }
    },
    {
        path: 'org',
        component: OrgAnalyticsComponent,
        canActivate: [AuthGuard],
    }
];

@NgModule({
    declarations: [AnalyticsComponent, OrgAnalyticsComponent],
    imports: [
        CoreCommonModule,
        RouterModule.forChild(routes),
        TranslateModule,
        NgbModule,
        PerfectScrollbarModule,
        NgApexchartsModule,
        CourseModule,
        InstructorsModule,
        OrganizationModule
    ],
    providers: [DashboardService],
    exports: []
})
export class DashboardModule {
}
