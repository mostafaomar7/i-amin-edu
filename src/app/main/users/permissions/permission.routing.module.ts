import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionListComponent } from './permission-list/permission-list.component';
import { NewPermissionComponent } from './new-permission/new-permission.component';


// routing
const routes: Routes = [
    {
        path: 'list',
        component: PermissionListComponent,
        data: { animation: 'PermissionListComponent' }
    },
    {
        path: 'list/new',
        component: NewPermissionComponent,
    },
    {
        path: 'list/new/:id',
        component: NewPermissionComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PermissionRoutingModule { }