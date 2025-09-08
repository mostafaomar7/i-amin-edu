import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { BrokerUserComponent } from './broker/broker-user/broker-user.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NewbrokerUserComponent } from './broker/newbroker-user/newbroker-user.component';
import { BrokerUserinfoComponent } from './broker/broker-userinfo/broker-userinfo.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

// routing
const routes: Routes = [
    {
        path: 'admins',
        loadChildren: () => import('./admins/admin.module').then(m => m.AdminModule)
    },
    {
        path: 'permissions',
        loadChildren: () => import('./permissions/permission.module').then(m => m.PermissionModule
        )
    },
    {
        path: 'instructors',
        loadChildren: () => import('./instructors/instructors.module').then(m => m.InstructorsModule
        )
    },
    {
        path: 'students',
        loadChildren: () => import('./students/student.module').then(m => m.StudentModule
        )
    },
    {
        path: 'organizations',
        loadChildren: () => import('./organizations/organization.module').then(m => m.OrganizationModule)
    }
];

@NgModule({
    declarations: [
    BrokerUserComponent,
    NewbrokerUserComponent,
    BrokerUserinfoComponent
  ],
    imports: [CommonModule, RouterModule.forChild(routes),NgxDatatableModule,TranslateModule,ReactiveFormsModule]
})
export class UsersModule {
}
