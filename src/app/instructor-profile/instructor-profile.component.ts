import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service'; // تأكد من الباث حسب البنية
@Component({
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrls: ['./instructor-profile.component.scss']
})
export class InstructorProfileComponent implements OnInit {

  profileData: any;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getInstructorProfile().subscribe({
      next: (res) => {
        if (res.status) {
          this.profileData = res.innerData;
        }
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      }
    });
  }

}
