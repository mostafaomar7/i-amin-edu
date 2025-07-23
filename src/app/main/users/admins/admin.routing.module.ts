import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminListComponent } from './admin-list/admin-list.component';
import { NewAdminComponent } from './new-admin/new-admin.component';


// routing
const routes: Routes = [
    {
        path: 'list',
        component: AdminListComponent,
        data: { animation: 'AdminListComponent' }
    },
    {
        path: 'list/new',
        component: NewAdminComponent,
    },
    {
        path: 'list/new/:id',
        component: NewAdminComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule { }