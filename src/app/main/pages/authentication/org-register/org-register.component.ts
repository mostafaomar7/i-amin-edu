import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthenticationService } from 'app/auth/service';
import { CoreConfigService } from '@core/services/config.service';
import { PortalListService } from 'app/main/apps/portals/portal-list.service';
import { SubjectListService } from 'app/main/apps/subjects/subject-list.service';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from '../i18n/en';
import { locale as arabic } from '../i18n/ar';
import Swal from 'sweetalert2';
import { info } from 'console';

@Component({
  selector: 'app-auth-login',
  templateUrl: './org-register.component.html',
  styleUrls: ['./org-register.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrgRegisterComponent implements OnInit {
  //  Public
  public coreConfig: any;
  public viewForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;
  public isLoading = true;
  countries = [
  { id: 1, name: 'مصر', flag: '🇪🇬' },
  { id: 2, name: 'السعودية', flag: '🇸🇦' }
];
  educationalGates: any;
  subjects: any;


  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _portalListService: PortalListService,
    private _subjectListService: SubjectListService,
    private _coreTranslationService: CoreTranslationService

  ) {
    // Configure the layout
    this._coreTranslationService.translate(english, arabic);

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
    return this.viewForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
  this.submitted = true;

  if (this.viewForm.invalid) {
    console.log('Form is invalid. Please check the fields.');

    // ✅ طباعة الأخطاء بالتفصيل
    Object.keys(this.viewForm.controls).forEach(field => {
      const control = this.viewForm.get(field);
      if (control && control.errors) {
        console.log(`❌ Field "${field}" errors:`, control.errors);
      }
    });

    this.viewForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  this._authenticationService.requestRegisterInstructor(this.viewForm.value)
    .then((response) => {
      this.loading = false;
      console.log(response);
      if (response.status) {
        localStorage.setItem('authToken', response.authToken);
        this.ConfirmColorOpen(response.message, true);
        this._router.navigate([this.returnUrl]);
      } else {
        this.error = response.message;
      }
    });
}


  ConfirmColorOpen(message: string, isSuccess: boolean) {
    Swal.fire({
      title: (isSuccess) ? 'Success!' : 'Failed!',
      text: message,
      icon: (isSuccess) ? 'success' : 'error',
      customClass: {
        confirmButton: 'btn btn-success'
      }
    });
  }

  async getGates() {
    await this._portalListService.getDataTableRows().then(response => {
      this.isLoading = false;
      if (response.status) {
        this.educationalGates = response.innerData;
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async getSubjects() {
    await this._subjectListService.getDataTableRows().then(response => {
      this.isLoading = false;
      if (response.status) {
        this.subjects = response.innerData;
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
  this.viewForm = this._formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    phone: ['', [Validators.required, Validators.pattern(/[0-9]{11}/)]],
    countryId: [null, [Validators.required]],       // ✅ إلزامي
    experienceAr: ['', [Validators.required]],      // ✅ إلزامي
    experienceEn: ['', [Validators.required]],      // ✅ إلزامي
    // info: ['', [Validators.required]],
    userType: 2
  });

  this.returnUrl =
    this._route.snapshot.queryParams['returnUrl'] || '/pages/auth/login';

  this._coreConfigService.config.subscribe(config => {
    this.coreConfig = config;
  });

  this.getSubjects();
  this.getGates();
}



  onStatusChange(): void { }

  onSubjectChange(): void { }

  onGateChange(): void { }

    /**
   * Handle Naviation
   */
    back() {
      // if (this.currentItem) {
      //   this.router.navigate(['../../'], { relativeTo: this.route });
      // } else {
      //   this.router.navigate(['../'], { relativeTo: this.route });
      // }
    }

}
