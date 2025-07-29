import { Component, OnInit, ViewChild } from '@angular/core';
import { WalletService } from '../wallet.service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { locale as english } from '../wallet/en';
import { locale as arabic } from '../wallet/ar';

import { CoreTranslationService } from '@core/services/translation.service';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  stats: any = null;
  lang: 'en' | 'ar' = 'ar'; // لغة افتراضية ممكن تغيرها
  
  translations: any;
  // Course Transactions
  rows = [];
  searchCourse = '';
  courseCurrentPage = 1;
  courseSelectedLimit = 10;
  courseTotal = 0;
  isCourseLoading = false;

  // Session Bookings
  sessionRows = [];
  searchSession = '';
  sessionCurrentPage = 1;
  sessionSelectedLimit = 10;
  sessionTotal = 0;
  isSessionLoading = false;

  // Debounce Subjects
  private courseSearchSubject = new Subject<void>();
  private sessionSearchSubject = new Subject<void>();

  ColumnMode = ColumnMode;

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private walletService: WalletService , private _coreTranslationService: CoreTranslationService) {
      this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadTransactions();
    this.loadSessionBookings();

    this.courseSearchSubject.pipe(debounceTime(400)).subscribe(() => {
      this.courseCurrentPage = 1;
      this.loadTransactions();
    });

    this.sessionSearchSubject.pipe(debounceTime(400)).subscribe(() => {
      this.sessionCurrentPage = 1;
      this.loadSessionBookings();
    });
  }

  async loadStats() {
    try {
      const res = await this.walletService.getWalletStats();
      if (res.status) {
        this.stats = res.innerData;
      }
    } catch (error) {
      console.error('Wallet Stats Error:', error);
    }
  }

  async loadTransactions() {
  this.isCourseLoading = true;
  try {
    console.log('Search value:', this.searchCourse);
    const [firstName, lastName] = this.searchCourse.trim().toLowerCase().split(' ');

    const res = await this.walletService.getCoursePurchases(
      this.courseCurrentPage,
      this.courseSelectedLimit,
      firstName || '',
      lastName || ''
    );
    console.log('Transactions response:', res);
    if (res.status) {
      this.rows = res.innerData.courseTransactions;
      this.courseTotal = res.innerData.totalItems || 0;
    } else {
      this.rows = [];
      this.courseTotal = 0;
    }
  } catch (error) {
    console.error('Transactions Error:', error);
    this.rows = [];
    this.courseTotal = 0;
  }
  this.isCourseLoading = false;
}


  onCourseSearchChange() {
    this.courseSearchSubject.next();
  }

  onCourseLimitChange(): void {
    this.courseCurrentPage = 1;
    this.loadTransactions();
  }

  onCoursePageChange(event: any): void {
    this.courseCurrentPage = event.offset + 1;
    this.loadTransactions();
  }

  async loadSessionBookings() {
    this.isSessionLoading = true;
    try {
      
      const [firstName, lastName] = this.searchSession.trim().toLowerCase().split(' ');

      const res = await this.walletService.getSessionBookings(
        this.sessionCurrentPage,
        this.sessionSelectedLimit,
        firstName || '',
        lastName || ''
      );

      console.log('session response:', res);
      console.log('Search session keyword:', this.searchSession);
      if (res.status) {
        this.sessionRows = res.innerData.sessionTransactions.map((tran: any) => {
          const studentUser = tran.livesession?.student?.user;
          const session = tran.livesession;
          const rawAmount = tran.amount;

          const afterAdmin = rawAmount * 0.6;
          const afterZego = afterAdmin * 0.5;
          const finalAmount = afterZego * 0.99;

          return {
            studentName: `${studentUser?.firstName ?? ''} ${studentUser?.lastName ?? ''}`,
            consultingType: 'solo',
            dateTime: session?.createdAt,
            title: session?.title,
            details: `Stage: ${session?.stageId}, Subject: ${session?.subjectId}`,
            amount: finalAmount.toFixed(2),
            roomId: session?.roomId,
            transactionStatus: tran.transactinStatus === 2 ? 'Completed' : 'Failed',
            createdAt: tran.createdAt,
          };
        });
        this.sessionTotal = res.innerData.totalItems;
      } else {
        this.sessionRows = [];
        this.sessionTotal = 0;
      }
    } catch (err) {
      console.error('Session Bookings Error:', err);
      this.sessionRows = [];
      this.sessionTotal = 0;
    }
    this.isSessionLoading = false;
  }

  onSessionSearchChange() {
    this.sessionSearchSubject.next();
  }

  onSessionLimitChange(): void {
    this.sessionCurrentPage = 1;
    this.loadSessionBookings();
  }

  onSessionPageChange(event: any): void {
    this.sessionCurrentPage = event.offset + 1;
    this.loadSessionBookings();
  }
}
