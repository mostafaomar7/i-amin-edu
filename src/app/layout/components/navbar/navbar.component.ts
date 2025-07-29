import { Component, HostBinding, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';

import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from 'app/auth/service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreConfigService } from '@core/services/config.service';
import { CoreMediaService } from '@core/services/media.service';

import { User } from 'app/auth/models';
import { Router } from '@angular/router';
import { UserLoginData } from '../../../main/pages/authentication/interfaces/user-login';
import { HttpClient } from '@angular/common/http';
import { NotificationsApiService } from './notifications-api.service';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit, OnDestroy {
    public horizontalMenu: boolean;
    public hiddenMenu: boolean;

    public coreConfig: any;
    public currentSkin: string;
    public prevSkin: string;

    public currentUser: User;

    public languageOptions: any;
    public navigation: any;
    public selectedLanguage: any;

    @HostBinding('class.fixed-top')
    public isFixed = false;

    @HostBinding('class.navbar-static-style-on-scroll')
    public windowScrolled = false;
    userData!: UserLoginData;
    // Private
    private _unsubscribeAll: Subject<any>;

    public notifications: any[] = [];
public unreadCount = 0;
public showNotifications = false;

isLast(noti: any): boolean {
  return this.notifications[this.notifications.length - 1] === noti;
}
   

    constructor(
        private _router: Router,
        private _authenticationService: AuthenticationService,
        private _coreConfigService: CoreConfigService,
        private _coreMediaService: CoreMediaService,
        private _coreSidebarService: CoreSidebarService,
        private _mediaObserver: MediaObserver,
        public _translateService: TranslateService,
        private _http: HttpClient,
        private _notificationsService: NotificationsApiService
    ) {
        // this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));

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

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // Add .navbar-static-style-on-scroll on scroll using HostListener & HostBinding
    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (
            (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) &&
            this.coreConfig.layout.navbar.type == 'navbar-static-top' &&
            this.coreConfig.layout.type == 'horizontal'
        ) {
            this.windowScrolled = true;
        } else if (
            (this.windowScrolled && window.pageYOffset) ||
            document.documentElement.scrollTop ||
            document.body.scrollTop < 10
        ) {
            this.windowScrolled = false;
        }
    }

    // Public Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebar(key): void {
        this._coreSidebarService.getSidebarRegistry(key).toggleOpen();
    }
     toggleNotifications() {
  this.showNotifications = !this.showNotifications;
  if (this.showNotifications) {
    this.fetchNotifications();
  }
}

fetchNotifications() {
  this._notificationsService.getAllNotifications()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res: any) => {
      if (res?.status && res?.innerData?.notifications) {
        console.log('Notification Response:', res);
        // هنا بنجيب المصفوفة من innerData.notifications بدل res.data
        this.notifications = res.innerData.notifications.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.unreadCount = this.notifications.filter(n => !n.isRead).length;
      } else {
        this.notifications = [];
        this.unreadCount = 0;
      }
    }, error => {
      console.error('Notification fetch failed', error);
      this.notifications = [];
      this.unreadCount = 0;
    });
}



    /**
     * Set the language
     *
     * @param language
     */
    setLanguage(language): void {
        // Set the selected language for the navbar on change
        this.selectedLanguage = language;

        // Use the selected language id for translations
        this._translateService.use(language);

        this._coreConfigService.setConfig({ app: { appLanguage: language } }, { emitEvent: true });

    }

    /**
     * Toggle Dark Skin
     */
    toggleDarkSkin() {
        // Get the current skin
        this._coreConfigService
            .getConfig()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(config => {
                this.currentSkin = config.layout.skin;
            });

        // Toggle Dark skin with prevSkin skin
        this.prevSkin = localStorage.getItem('prevSkin');

        if (this.currentSkin === 'dark') {
            this._coreConfigService.setConfig(
                { layout: { skin: this.prevSkin ? this.prevSkin : 'default' } },
                { emitEvent: true }
            );
        } else {
            localStorage.setItem('prevSkin', this.currentSkin);
            this._coreConfigService.setConfig({ layout: { skin: 'dark' } }, { emitEvent: true });
        }
    }

    /**
     * Logout method
     */
    logout() {
        this._authenticationService.logout();
        // location.reload();
        this._router.navigate(['/pages/auth/login']).then();
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // get the currentUser details from localStorage
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userData = JSON.parse(localStorage.getItem('userData'));
        console.log('-> this.userData', this.userData);
        console.log('-> this.currentUser', this.currentUser);

        // Subscribe to the config changes
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
            this.horizontalMenu = config.layout.type === 'horizontal';
            this.hiddenMenu = config.layout.menu.hidden === true;
            this.currentSkin = config.layout.skin;

            // Fix: for vertical layout if default navbar fixed-top than set isFixed = true
            if (this.coreConfig.layout.type === 'vertical') {
                setTimeout(() => {
                    if (this.coreConfig.layout.navbar.type === 'fixed-top') {
                        this.isFixed = true;
                    }
                }, 0);
            }
        });

        // Horizontal Layout Only: Add class fixed-top to navbar below large screen
        if (this.coreConfig.layout.type == 'horizontal') {
            // On every media(screen) change
            this._coreMediaService.onMediaUpdate.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                const isFixedTop = this._mediaObserver.isActive('bs-gt-xl');
                if (isFixedTop) {
                    this.isFixed = false;
                } else {
                    this.isFixed = true;
                }
            });
        }

        // Set the selected language from default languageOptions
        this.selectedLanguage = _.find(this.languageOptions, {
            id: this._translateService.currentLang
        });

        this.fetchNotifications();

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
