import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr'; // For auth after login toast
import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';

import { coreConfig } from 'app/app-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { HomeModule } from 'app/main/home/home.module';
import { AppRoutingModule } from './app-routing.module';
import { WalletComponent } from './app/main/apps/wallet/wallet.component';

// **استيراد NgxDatatableModule هنا**
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { InstructorProfileComponent } from './instructor-profile/instructor-profile.component';
import { UpdateProfileComponent } from './instructor-profile/update-profile/update-profile.component';
import { UpdatePasswordComponent } from './instructor-profile/update-profile/update-password/update-password.component';
import { LivesessionComponent } from './app/main/apps/livesession/livesession.component';
import { JoinLiveSessionComponent } from './app/main/apps/livesession/join-live-session/join-live-session.component';
import { LiveroomComponent } from './app/main/apps/livesession/liveroom/liveroom.component';
import { FormsModule } from '@angular/forms';
import { CurrencyComponent } from './main/apps/courselass/currency/currency.component';

@NgModule({
    declarations: [AppComponent, CurrencyComponent, WalletComponent, InstructorProfileComponent, UpdateProfileComponent, UpdatePasswordComponent, LivesessionComponent, JoinLiveSessionComponent, LiveroomComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        TranslateModule.forRoot(),
        FormsModule,
        //NgBootstrap
        NgbModule,
        ToastrModule.forRoot(),

        // Core modules
        CoreModule.forRoot(coreConfig),
        CoreCommonModule,
        CoreSidebarModule,
        CoreThemeCustomizerModule,

        // App modules
        LayoutModule,
        HomeModule,

        // **أضف NgxDatatableModule هنا**
        NgxDatatableModule
    ],

    bootstrap: [AppComponent]
})
export class AppModule {}
