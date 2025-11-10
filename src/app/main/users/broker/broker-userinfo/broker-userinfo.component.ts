import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from '../broker-user/en';
import { locale as arabic } from '../broker-user/ar';

@Component({
  selector: 'app-broker-userinfo',
  templateUrl: './broker-userinfo.component.html',
  styleUrls: ['./broker-userinfo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BrokerUserinfoComponent implements OnInit {
  userId!: number;
  userData: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!;

    this.userService.getUserById(this.userId).subscribe({

  next: (res) => {
    console.log('User Data:', res.data);
    if (res.status && res.data) {
      const user = res.data;

      // لو الصورة موجودة ولكن بدون المسار الكامل
      if (user.image && !user.image.startsWith('http')) {
        user.image = `https://www.iamin-edu.com/develop/api/v1/uploads/${user.image}`;
      }

      this.userData = user;
    }
  },
  error: (err) => {
    console.error('Error fetching user details', err);
  }
});

  }
  mapUserType(type: any): string {
  if (type === 2 || type === '2') return 'Organization';
  if (type === 3 || type === '3') return 'Instructor';
  return type;
}

}
