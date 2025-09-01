import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { en } from '../en';
import { ar } from '../ar';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {

  profileForm!: FormGroup;
  loading: boolean = true;
  successMessage: string = '';
errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private translate: TranslateService
  ) {
    // تحميل ملفات الترجمة
    this.translate.setTranslation('en', en, true);
    this.translate.setTranslation('ar', ar, true);
    this.translate.setDefaultLang('en');
    this.translate.use('en'); // أو 'ar' حسب اللغة الحالية
  }

  ngOnInit(): void {
    this.profileService.getInstructorProfile().subscribe({
      next: (res) => {
        const data = res.innerData;
        this.profileForm = this.fb.group({
          firstName: [data.user.firstName],
          lastName: [data.user.lastName],
          phone: [data.user.phone],
          // email: [data.user.email],
          experienceEn: [data.experienceEn],
          experienceAr: [data.experienceAr],
          // countryId: [data.user.countryId]
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
  if (this.profileForm.invalid) return;

  this.profileService.updateInstructorProfile(this.profileForm.value).subscribe({
    next: () => {
      this.successMessage = this.translate.instant('PROFILE.UPDATE_SUCCESS');
      this.errorMessage = '';
    },
    error: (err) => {
      console.error('Update error:', err);
      this.errorMessage = this.translate.instant('PROFILE.UPDATE_ERROR');
      this.successMessage = '';
    }
  });
}

}
