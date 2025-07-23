import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayoutRequestsListComponent } from './payout-requests-list/payout-requests-list.component';
import { NewPayoutRequestsComponent } from './new-payout-requests/new-payout-requests.component';


// routing
const routes: Routes = [
    {
        path: 'list',
        component: PayoutRequestsListComponent,
        data: { animation: 'PayoutRequestsListComponent' }
    },
    {
        path: 'list/new',
        component: NewPayoutRequestsComponent,
    },
    {
        path: 'list/new/:id',
        component: NewPayoutRequestsComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PayoutRequestsRoutingModule { }