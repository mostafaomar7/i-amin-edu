import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {CoreCommonModule} from '@core/common.module';

import {AuthLoginComponent} from 'app/main/pages/authentication/auth-login/auth-login.component';
import {InstructorRegisterComponent} from './instructor-register/instructor-register.component';
import {SubjectListService} from 'app/main/apps/subjects/subject-list.service';
import {PortalListService} from 'app/main/apps/portals/portal-list.service';
import {TranslateModule} from '@ngx-translate/core';
import {OrgRegisterComponent} from './org-register/org-register.component';
import {GuestGuards} from '../../../auth/helpers/guest.guards';
import { BrokerRegisterComponent } from './broker-register/broker-register.component';

// routing
const routes: Routes = [
    {
        path: 'auth/login',
        component: AuthLoginComponent,
        data: {animation: 'auth'},
        canActivate: [GuestGuards]
    },
    {
        path: 'auth/org-register',
        component: OrgRegisterComponent,
        data: {animation: 'auth'}
    },
    {
        path: 'auth/instructor-register',
        component: InstructorRegisterComponent,
        data: {animation: 'auth'}
    },
    {
        path: 'auth/org-broker',
        component: BrokerRegisterComponent,
        data: {animation: 'auth'}
    },
];

@NgModule({
    declarations: [AuthLoginComponent, InstructorRegisterComponent, OrgRegisterComponent, BrokerRegisterComponent],
    imports: [CommonModule, RouterModule.forChild(routes), NgbModule, FormsModule, ReactiveFormsModule, CoreCommonModule, TranslateModule],
    providers: [SubjectListService, PortalListService]
})
export class AuthenticationModule {
}
