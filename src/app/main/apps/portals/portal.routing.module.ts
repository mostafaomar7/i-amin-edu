import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortalListComponent } from './portal-list/portal-list.component';
import { NewPortalComponent } from './new-portal/new-portal.component';
import { PortalPreviewComponent } from './portal-view/portal-preview.component';


// routing
const routes: Routes = [
    {
        path: 'list',
        component: PortalListComponent,
        data: { animation: 'PortalListComponent' }
    },
    {
        path: 'portal-list/view',
        component: PortalPreviewComponent,
    },
    {
        path: 'list/new',
        component: NewPortalComponent,
    },
    {
        path: 'list/new/:id',
        component: NewPortalComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PortalRoutingModule { }