import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


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
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes)]
})
export class UsersModule {
}
