import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ProfileService } from './profile.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { en } from './en';
import { ar } from './ar';

@Component({
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrls: ['./instructor-profile.component.scss']
})
export class InstructorProfileComponent implements OnInit {

  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

  profileData: any[] = [];
  bankAccounts: any[] = [];
  usertype : any = localStorage.getItem("userType")
  columns: any[] = [];
  currency: string = '';
  bankAccountData = {
    bankAccountNumber: '',
    bankAccountName: '',
    bankName: '',
    bankCode: ''
  };

  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  showToast: boolean = false;

  constructor(
    private profileService: ProfileService,
    private translate: TranslateService
  ) {
    this.translate.setTranslation('en', en, true);
    this.translate.setTranslation('ar', ar, true);
    this.translate.setDefaultLang('en');
    this.translate.use('en'); // أو 'en' حسب اللغة الحالية
  }

ngOnInit(): void {
  this.loadProfileData();
  this.loadBankAccounts();
  this.loadTranslatedColumns();

  // 👇 تحديد العملة بناءً على الدولة من localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const countryId = userData?.countryId;

  if (countryId === 1) {
    this.currency = 'EGP';
  } else if (countryId === 2) {
    this.currency = 'SAR';
  } 

  this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    this.loadTranslatedColumns();
  });
}


  loadTranslatedColumns(): void {
  this.translate.get([
    'id',
    'accountNumber',
    'accountHolderName',
    'bankName',
    'bankCode',
    'createdAt',
    // 'updatedAt',
    'actions'
  ]).subscribe(trans => {
    this.columns = [
      { prop: 'id', name: trans['id'] },
      { prop: 'bankAccountNumber', name: trans['accountNumber'] },
      { prop: 'bankAccountName', name: trans['accountHolderName'] },
      { prop: 'bankName', name: trans['bankName'] },
      { prop: 'bankCode', name: trans['bankCode'] },
      { prop: 'createdAt', name: trans['createdAt'] },
      // { prop: 'updatedAt', name: trans['updatedAt'] },
      {
        name: trans['actions'],
        prop: 'actions',
        sortable: false,
        canAutoResize: false,
        draggable: false,
        resizeable: false,
        cellTemplate: this.actionsTemplate
      }
    ];
  });
}


  loadProfileData() {
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

  showCustomToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }

  submitBankAccount(): void {
  Swal.fire({
    title: this.translate.instant('Profile Confirm Add Title'),
    text: this.translate.instant('PROFILE CONFIRM ADD TEXT'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: this.translate.instant('YES'),
    cancelButtonText: this.translate.instant('NO')
  }).then(result => {
    if (result.isConfirmed) {
      this.profileService.addBankAccount(this.bankAccountData).subscribe({
        next: (res: any) => {
          if (res.status) {
            const message = this.translate.instant('PROFILE.TOAST_SUCCESS');
            this.showCustomToast('✅ ' + message, 'success');

            // ضيف الحساب الجديد مباشرة
            this.bankAccounts = [...this.bankAccounts, res.innerData];

            // امسح الفورم
            this.bankAccountData = {
              bankAccountNumber: '',
              bankAccountName: '',
              bankName: '',
              bankCode: ''
            };
          }
        },
        error: () => {
          const message = this.translate.instant('PROFILE.TOAST_ERROR');
          this.showCustomToast('❌ ' + message, 'error');
        }
      });
    }
  });
}

deleteBankAccount(id: number) {
  Swal.fire({
    title: this.translate.instant('Profile Confirm Delete Title'),
    text: this.translate.instant('PROFILE CONFIRM DELETE TEXT'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: this.translate.instant('YES'),
    cancelButtonText: this.translate.instant('NO')
  }).then(result => {
    if (result.isConfirmed) {
      this.profileService.deleteBankAccount(id).subscribe({
        next: () => {
          const msg = this.translate.instant('PROFILE.DELETE_SUCCESS');
          this.showCustomToast(msg, 'success');
          this.bankAccounts = this.bankAccounts.filter(acc => acc.id !== id);
        },
        error: () => {
          const msg = this.translate.instant('PROFILE.DELETE_ERROR');
          this.showCustomToast(msg, 'error');
        }
      });
    }
  });
}



  loadBankAccounts() {
    this.profileService.getBankAccounts().subscribe({
      next: (res) => {
        if (res.status) {
          this.bankAccounts = res.innerData;
        }
      },
      error: (err) => {
        console.error('Failed to fetch bank accounts', err);
      }
    });
  }
}
