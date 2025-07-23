import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { AuthenticationService } from 'app/auth/service';
import { CoreConfigService } from '@core/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as english } from '../i18n/en';
import { locale as arabic } from '../i18n/ar';
import { CoreTranslationService } from '@core/services/translation.service';
import { ApiResult } from '../../../../../@core/types/api-result';
import { UserLoginData } from '../interfaces/user-login';
import { CoreMenuService } from '../../../../../@core/components/core-menu/core-menu.service';
import { getMenuItems } from '../../../../../@shared/utils/get-menu-items';

@Component({
    selector: 'app-auth-login',
    templateUrl: './auth-login.component.html',
    styleUrls: ['./auth-login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AuthLoginComponent implements OnInit {
    //  Public
    public coreConfig: any;
    public loginForm: UntypedFormGroup;
    public loading = false;
    public submitted = false;
    public returnUrl: string;
    public error = '';
    public passwordTextType: boolean;
    public languageOptions: any;
    public selectedLanguage: any;
    public locale: any;


    constructor(
        private _coreConfigService: CoreConfigService,
        private _formBuilder: UntypedFormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        private _authenticationService: AuthenticationService,
        public _translateService: TranslateService,
        private _coreTranslationService: CoreTranslationService,
        private _coreMenuService: CoreMenuService
    ) {
        this._coreTranslationService.translate(english, arabic);
        this.languageOptions = {
            en: {
                title: 'English',
                flag: 'us'
            },
            ar: {
                title: 'العربيه',
                flag: 'sa'
            }
        };

        // Configure the layout
        this._coreConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                menu: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                customizer: false,
                enableLocalStorage: false
            }
        };
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    /**
     * Toggle password
     */
    togglePasswordTextType() {
        this.passwordTextType = !this.passwordTextType;
    }

    onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        const request = {
            email: this.f.email.value,
            password: this.f.password.value,
        };
        this._authenticationService.requestLogin(request).then((response: ApiResult<UserLoginData>) => {
            this.loading = false;
            if (response.status) {
                console.log('requestLogin', response);
                this._authenticationService.userData$.next(response.innerData);
                localStorage.setItem('authToken', response.authToken);
                localStorage.setItem('userType', response.innerData.userType.toString());
                localStorage.setItem('userData', JSON.stringify(response.innerData));
                this.loginActions();
                // localStorage.setItem('roleId', `${response.innerData.role.id}`);

                if (response.innerData.userType == 2) {
                    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/dashboard/org';
                }

                this._router.navigate([this.returnUrl], { replaceUrl: true });

                this.error = response.message;
            } else {
                this.error = response.message;
            }
        });
    }

    loginActions() {
        const userData = this._authenticationService.userData$.value;
        console.log('-> loginActions ', userData);
        if (userData && userData?.userType && userData?.userType) {
            console.log('-> loginActions userData?.userType', userData?.userType);
            const menu = getMenuItems(userData.userType);
            // Register the menu to the menu service
            this._coreMenuService.unregister('main');
            this._coreMenuService.register('main', menu);
            this._coreMenuService.setCurrentMenu('main');
        }
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this._coreConfigService.config.subscribe(config => {
            this.locale = config.app.appLanguage;
        });

        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        // Subscribe to config changes
        this._coreConfigService.config.subscribe(config => {
            this.coreConfig = config;
        });

        // Set the selected language from default languageOptions
        this.selectedLanguage = _.find(this.languageOptions, {
            id: this._translateService.currentLang
        });

        // get return url from route parameters or default to '/'

        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/dashboard';

        const storedLanguage = localStorage.getItem('selectedLanguage');

        if (storedLanguage) {
            this.setLanguage(storedLanguage);  // Use the stored language
        }


    }

    setLanguage(language): void {
        // Set the selected language for the navbar on change
        this.selectedLanguage = language;

        // Use the selected language id for translations
        this._translateService.use(language);

        localStorage.setItem('selectedLanguage', language);
        this._coreConfigService.setConfig({
            app: { appLanguage: language }, layout: {
                navbar: {
                    hidden: true
                },
                menu: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                customizer: false,
                enableLocalStorage: false
            }
        }, { emitEvent: true });
    }
}
