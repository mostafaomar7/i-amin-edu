import { Component, Input, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import * as feather from 'feather-icons';
import { CoreTranslationService } from '@core/services/translation.service';
import { UserService } from '../user.service';
import { locale as english } from './en';
import { locale as arabic } from './ar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-broker-user',
  templateUrl: './broker-user.component.html',
  styleUrls: ['./broker-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BrokerUserComponent implements OnInit, AfterViewInit {
  @Input() hasHeader: boolean = true;

  public isLoading = true;
  public rows: any[] = [];
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = '';

  lang: 'en' | 'ar' = 'ar';
  translations: any;

  constructor(
    private router: Router,
    private _coreTranslationService: CoreTranslationService,
    private _user: UserService,
    private sanitizer: DomSanitizer
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  ngAfterViewInit(): void {
    feather.replace();
  }

  fetchUsers() {
    this.isLoading = true;
    this._user.listUsers().subscribe({
      next: (res) => {
        if (res.status && res.data?.users) {
          // تحويل الـ API data لتتناسب مع جدولك
          this.rows = res.data.users.map((user: any, index: number) => ({
            id: user.userId,
            image: this.getSafeImage(user.image),
            name: user.username,
            phone: user.phone,
            role: this.mapUserType(user.userType || user.role),
            status: user.status
          }));
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching users', err);
        this.isLoading = false;
      }
    });
  }

  // تحويل الصور إلى SafeUrl لدعم Base64 و URLs
getSafeImage(image: string): SafeUrl {
  if (!image) {
    return 'assets/images/default-user-image.png';
  }
  return this.sanitizer.bypassSecurityTrustUrl(image);
}

  // تحويل userType الرقم إلى نص إذا لزم
  mapUserType(type: any): string {
    if (type === 2 || type === '2') return 'Organization';
    if (type === 3 || type === '3') return 'Instructor';
    return type; // لو كان نص مسبقًا
  }

  filterUpdate(event: any) {
    const val = event.target.value.toLowerCase();
    this.rows = this.rows.filter(d =>
      d.id.toString().toLowerCase().indexOf(val) !== -1 || !val
    );
  }

  addItem() {
    this.router.navigate([`newuser-broker`]);
  }

  eyeRoute(row: any) {
  this.router.navigate([`userinfo-broker`, row.id]);
}

}
