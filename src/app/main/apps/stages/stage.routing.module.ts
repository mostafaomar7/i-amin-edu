import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StageListComponent } from './stage-list/stage-list.component';
import { NewStageComponent } from './new-stage/new-gate.component';


// routing
const routes: Routes = [
    {
        path: 'list',
        component: StageListComponent,
        data: { animation: 'StageListComponent' }
    },
    {
        path: 'list/new',
        component: NewStageComponent,
    },
    {
        path: 'list/new/:id',
        component: NewStageComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class StageRoutingModule { }