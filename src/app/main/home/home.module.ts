import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {CoreCommonModule} from '@core/common.module';

import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';

import {HomeComponent} from './home.component';
import {HomeService} from './home.service';
import {NgbDropdownModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';

const routes = [
    {
        path: 'home',
        component: HomeComponent,
        data: {animation: 'home'}
    },
    {
        path: 'dashboard',
        component: HomeComponent,
        data: {animation: 'dashbaord'}
    }
];

@NgModule({
    declarations: [HomeComponent],
    imports: [RouterModule.forChild(routes), NgbModule, ContentHeaderModule, TranslateModule, CoreCommonModule, NgbDropdownModule],
    exports: [HomeComponent],
    providers: [HomeService]
})
export class HomeModule {
}
