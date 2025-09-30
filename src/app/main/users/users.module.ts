import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { BrokerUserComponent } from './broker/broker-user/broker-user.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NewbrokerUserComponent } from './broker/newbroker-user/newbroker-user.component';
import { BrokerUserinfoComponent } from './broker/broker-userinfo/broker-userinfo.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrokersListComponent } from './admin-brokers/brokers-list/brokers-list.component';
import { BrokersViewComponent } from './admin-brokers/brokers-view/brokers-view.component';
import { NewBrokerComponent } from './admin-brokers/new-broker/new-broker.component';

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
    },
    {
        path : 'broker-list',
        component : BrokersListComponent
    },
    {
        path : 'brokers/list/new',
        component : NewBrokerComponent
    },
    {
        path : 'brokers/list/new/:id',
        component : NewBrokerComponent
    }
];

@NgModule({
    declarations: [
    BrokerUserComponent,
    NewbrokerUserComponent,
    BrokerUserinfoComponent,
    BrokersListComponent,
    BrokersViewComponent,
    NewBrokerComponent
  ],
    imports: [CommonModule, RouterModule.forChild(routes),NgxDatatableModule,TranslateModule,ReactiveFormsModule , FormsModule]
})
export class UsersModule {
}
