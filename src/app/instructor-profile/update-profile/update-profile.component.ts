import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {

  profileForm!: FormGroup;
  loading: boolean = true;

  constructor(private fb: FormBuilder, private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getInstructorProfile().subscribe({
      next: (res) => {
        const data = res.innerData;
        this.profileForm = this.fb.group({
          firstName: [data.user.firstName],
          lastName: [data.user.lastName],
          phone: [data.user.phone],
          email: [data.user.email],
          experienceEn: [data.experienceEn],
          countryId: [data.user.countryId]
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
      next: (res) => {
        alert('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Update error:', err);
        alert('Failed to update profile');
      }
    });
  }

}
