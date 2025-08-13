import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../profile.service';
import { TranslateService } from '@ngx-translate/core';
import { en } from '../../en';
import { ar } from '../../ar';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  passwordForm!: FormGroup;
  errorMsg = '';
  successMsg = '';

  showOldPassword = false;
  showNewPassword = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private translate: TranslateService
  ) {
    this.translate.setTranslation('en', en, true);
    this.translate.setTranslation('ar', ar, true);
    this.translate.setDefaultLang('en');
    this.translate.use('en'); // أو 'ar' حسب اللغة الحالية
  }

  toggleOldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) return;

    const { oldPassword, newPassword } = this.passwordForm.value;

    this.profileService.resetPassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.successMsg = this.translate.instant('PROFILE.PASSWORD_UPDATE_SUCCESS');
        this.errorMsg = '';
        this.passwordForm.reset();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || this.translate.instant('PROFILE.PASSWORD_UPDATE_ERROR');
        this.successMsg = '';
      }
    });
  }
}
