import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None
})
export class WalletComponent implements OnInit {
  stats: any = null;
  brokerStats : any [] = [];
  lang: 'en' | 'ar' = 'ar'; // لغة افتراضية ممكن تغيرها
  public userType:any;
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
currency: string = ''; // القيمة الافتراضية

  // Debounce Subjects
  private courseSearchSubject = new Subject<void>();
  private sessionSearchSubject = new Subject<void>();

  ColumnMode = ColumnMode;

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private walletService: WalletService , private _coreTranslationService: CoreTranslationService) {
      this._coreTranslationService.translate(english, arabic);
  }

ngOnInit(): void {
  this.userType = Number(localStorage.getItem('userType'));
  
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const countryId = userData?.countryId;

  // تحديد العملة حسب الدولة
  if (countryId === 1) {
    this.currency = ' EGP';
  } else if (countryId === 2) {
    this.currency = ' SAR';
  }

  if (this.userType === 2 || this.userType === 3) {
    this.loadStats();
    this.loadTransactions();
    this.loadSessionBookings();
  } else if (this.userType === 5) {
    this.getBrokerTransaction();
  }

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

async getBrokerTransaction() {
  try {
    const res = await this.walletService.getBrokerWallet();
    console.log('broker stats raw:', res);

    if (res.status) {
      const data = res['data'];

      this.brokerStats = [
        {
          label: 'WALLET.SUCCESSFUL_TRANSACTIONS',
          value: data.totalCompletedTransactions,
        },
        {
          label: 'WALLET.FAILED_TRANSACTIONS',
          value: data.totalFailedTransactions,
        },
        {
          label: 'WALLET.COURSES_AMOUNT',
          value: data.totalCourseAmount.toFixed(2) + this.currency,
        },
        {
          label: 'WALLET.SESSIONS_AMOUNT',
          value: data.totalConsultantAmount.toFixed(2) + this.currency,
        },
        {
          label: 'WALLET.TOTAL',
          value: data.totalAmountTransactions.toFixed(2) + this.currency,
          isTotal: true // علامة للـ HTML لإضافة الكلاس total
        }
      ];

      console.log('broker stats formatted:', this.brokerStats);
    }
  } catch (error) {
    console.error('Wallet Stats Error:', error);
  }
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
