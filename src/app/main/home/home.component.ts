import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreConfigService } from '@core/services/config.service';
import { HomePageData, HomeService } from './home.service';
import Swal from 'sweetalert2';
import { locale as english } from './i18n/en';
import { locale as arabic } from './i18n/ar';
import { CoreTranslationService } from '../../../@core/services/translation.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

    // Variables
    slides = [];
    currentSlide = 0;
    slideInterval: any;

    contactForm: FormGroup;
    loading = false;
    homePageData!: HomePageData;
    selectedLanguage: any;
    isArabic: boolean = false;
    languageOptions: any;

    constructor(
        private _coreConfigService: CoreConfigService,
        private fb: FormBuilder,
        private _homeService: HomeService,
        private _coreTranslationService: CoreTranslationService,
        public _translateService: TranslateService,
    ) {

        // Initialize form
        this.contactForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            message: ['', Validators.required]
        });

        // Configure the layout
        this._coreConfigService.config = {
            layout: {
                navbar: { hidden: true },
                menu: { hidden: true },
                footer: { hidden: true },
                customizer: false,
                enableLocalStorage: false
            }
        };

        // Language options
        this.languageOptions = {
            en: { title: 'English', flag: 'us' },
            ar: { title: 'العربيه', flag: 'sa' }
        };

        // Load translations
        this._coreTranslationService.translate(english, arabic);
    }

    /**
     * Set the language and update RTL/LTR layout accordingly
     *
     * @param language The language to set
     */
    setLanguage(language: string): void {
        this.selectedLanguage = language;
        this._translateService.use(language);
        this.isArabic = (language === 'ar');  // Set isArabic based on language

        // Save the selected language in localStorage
        localStorage.setItem('selectedLanguage', language);

        this.loadSlides();  // Reload slides with the new language
    }


    // Lifecycle Hooks

    /**
     * On component init
     */
    ngOnInit() {
        // Check if a language is stored in localStorage
        const storedLanguage = localStorage.getItem('selectedLanguage');

        if (storedLanguage) {
            this.setLanguage(storedLanguage);  // Use the stored language
        } else {
            // If no language is stored, set the default language
            this.selectedLanguage = this._translateService.currentLang;
            this.isArabic = this.selectedLanguage === 'ar';  // Set isArabic flag based on the current language
            this.loadSlides();
        }

        this.play();  // Start the slider

        // Fetch home page data
        this._homeService.getHomePageData().then((response) => {
            this.homePageData = response.innerData;
        });
    }

    /**
     * On component destroy
     */
    ngOnDestroy(): void {
        this.pause();  // Pause the slider when the component is destroyed
    }

    // Slider Controls

    /**
     * Go to the next slide
     */
    next(): void {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }

    /**
     * Go to the previous slide
     */
    prev(): void {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    }

    /**
     * Start playing the slider automatically
     */
    play(): void {
        this.slideInterval = setInterval(() => this.next(), 5000);
    }

    /**
     * Pause the slider
     */
    pause(): void {
        clearInterval(this.slideInterval);
    }

    loadSlides() {
        this.slides = [
            {
                image: '../../../assets/images/slider-1.png',
                title: this._coreTranslationService.translator.instant('title1'),
                subtitle: this._coreTranslationService.translator.instant('subtitle1')
            },
            {
                image: '../../../assets/images/slider-2.png',
                title: this._coreTranslationService.translator.instant('title2'),
                subtitle: this._coreTranslationService.translator.instant('subtitle2')
            },
            {
                image: '../../../assets/images/slider-3.png',
                title: this._coreTranslationService.translator.instant('title3'),
                subtitle: this._coreTranslationService.translator.instant('subtitle3')
            }
        ];
    }

    // Form Submission

    /**
     * Handle form submission
     */
    onSubmit(): void {
        if (this.contactForm.valid) {
            this._homeService.contactUs(this.contactForm.value).then((response) => {
                if (response.status) {
                    this.contactForm.reset();
                    this.ConfirmColorOpen(response.message, true);
                } else {
                    this.ConfirmColorOpen(response.message, false);
                }
            });
        }
    }

    /**
     * Show confirmation alert
     *
     * @param message The message to display
     * @param isSuccess Whether the operation was successful
     */
    ConfirmColorOpen(message: string, isSuccess: boolean): void {
        Swal.fire({
            title: isSuccess ? 'Success!' : 'Failed!',
            text: message,
            icon: isSuccess ? 'success' : 'error',
            customClass: { confirmButton: 'btn btn-success' }
        });
    }
}
