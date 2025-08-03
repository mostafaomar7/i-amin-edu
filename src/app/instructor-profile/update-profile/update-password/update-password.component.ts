import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../profile.service';

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

toggleOldPasswordVisibility() {
  this.showOldPassword = !this.showOldPassword;
}

toggleNewPasswordVisibility() {
  this.showNewPassword = !this.showNewPassword;
}

  constructor(private fb: FormBuilder, private profileService: ProfileService) {}

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
      this.successMsg = 'Password updated successfully!';
      this.errorMsg = '';
      this.passwordForm.reset();
    },
    error: (err) => {
      this.errorMsg = err?.error?.message || 'Something went wrong.';
      this.successMsg = '';
    }
  });
}

}
