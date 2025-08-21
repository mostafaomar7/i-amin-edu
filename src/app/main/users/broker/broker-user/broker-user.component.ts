import { Component, Input, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import * as feather from 'feather-icons';

// استيراد التراجم
import { locale as english } from './en';
import { locale as arabic } from './ar';
import { CoreTranslationService } from '@core/services/translation.service';

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
  public ColumnMode = ColumnMode;   // مهم جداً للـ ngx-datatable
  public searchValue = '';

  lang: 'en' | 'ar' = 'ar'; // لغة افتراضية
  translations: any;

  constructor(
    private router: Router,
    private _coreTranslationService: CoreTranslationService
  ) {
    // تحميل التراجم للكمبونينت
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.rows = [
      { id: 1, name: 'Ahmed Ali', phone: '01012345678', role: 'instructor', status: 'Active' },
      { id: 2, name: 'Sara Mohamed', phone: '01198765432', role: 'organization', status: 'Inactive' },
      { id: 3, name: 'Omar Hassan', phone: '01234567890', role: 'instructor', status: 'Active' }
    ];
  }

  ngAfterViewInit(): void {
    feather.replace(); // علشان يحوّل [data-feather] → SVG
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

  eyeRoute() {
    this.router.navigate([`userinfo-broker`]);
  }
}
