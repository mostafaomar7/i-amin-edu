import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { NewOrganizationComponent } from './new-organization/new-organization.component';
import { OrganizationPreviewComponent } from './organization-view/organization-preview.component';


// routing
const routes: Routes = [
    {
        path: 'list',
        component: OrganizationListComponent,
        data: { animation: 'OrganizationListComponent' }
    },
    {
        path: 'list/view/:id',
        component: OrganizationPreviewComponent,
    },
    {
        path: 'list/new',
        component: NewOrganizationComponent,
    },
    {
        path: 'list/new/:id',
        component: NewOrganizationComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class OrganizationRoutingModule { }