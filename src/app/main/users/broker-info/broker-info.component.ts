import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import feather from 'feather-icons';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';
import {
  BrokerinfoService,
  BrokerStatisticsResponse,
  BrokerTeachersResponse,
  BrokerCentersResponse
} from './brokerinfo.service';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from './i18n/en';
import { locale as arabic } from './i18n/ar';

@Component({
  selector: 'app-broker-info',
  templateUrl: './broker-info.component.html',
  styleUrls: ['./broker-info.component.scss']
})
export class BrokerInfoComponent implements OnInit {
  statistics: BrokerStatisticsResponse['innerData'] | null = null;
  teachers: any[] = [];
  centers: any[] = [];
  payouts: any[] = [];
  showRequestInput = false;
  withdrawAmount: number | null = null;

  brokerId!: number; // 👈 هنخليها متغيرة مش ثابتة
     currency: string = '';
  constructor(
    private brokerInfoService: BrokerinfoService,
    private route: ActivatedRoute, // 👈 نضيفها هنا
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const countryId = userData?.countryId;

  if (countryId === 1) {
    this.currency = 'EGP';
  } else if (countryId === 2) {
    this.currency = 'SAR';
  } 
    // 👇 ناخد brokerId من الـ URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('userId');
      if (id) {
        this.brokerId = +id; // نحولها لرقم
        this.loadStatistics();
        this.loadTeachers();
        this.loadCenters();
    this.loadPayouts();
      } else {
        console.error('❌ brokerId not found in route!');
      }
    });
  }

  loadStatistics(): void {
    this.brokerInfoService.getBrokerStatistics(this.brokerId).subscribe({
      next: (res) => {
        if (res.status && res.innerData) this.statistics = res.innerData;
        feather.replace();
      },
      error: (err) => console.error('Error loading broker statistics:', err)
    });
  }

  loadTeachers(): void {
    this.brokerInfoService.getBrokerTeachers(this.brokerId).subscribe({
      next: (res: BrokerTeachersResponse) => {
        if (res.status && res.data) {
          this.teachers = res.data.map((t) => ({
            name: `${t.user?.firstName || ''} ${t.user?.lastName || ''}`.trim(),
            email: t.user?.email || '',
            phone: t.user?.phone || '—',
            commission: t.commission ?? 0,
            documentsCompleted: t.documentsCompleted,
            canGoLive: t.canGoLive,
            createdAt: t.createdAt,
            image: t.user?.image
              ? `${environment.apiUrl}/uploads/${t.user.image}`
              : 'assets/images/placeholder.png'
          }));
        }
      },
      error: (err) => console.error('Error loading teachers:', err)
    });
  }

  loadCenters(): void {
    this.brokerInfoService.getBrokerCenters(this.brokerId).subscribe({
      next: (res: BrokerCentersResponse) => {
        if (res.status && res.data) {
          this.centers = res.data.map((c) => ({
            name: c.name,
            email: c.user.email,
            phone: c.user.phone,
            commission: c.commission,
            isActive: c.isActive
              ? this._coreTranslationService.translator.instant('CENTER_TABLE.ACTIVE')
              : this._coreTranslationService.translator.instant('CENTER_TABLE.INACTIVE')
          }));
        }
      },
      error: (err) => console.error('Error loading centers:', err)
    });
  }

  
toggleRequestInput(): void {
  this.showRequestInput = !this.showRequestInput;
}
loadPayouts(): void {
  this.brokerInfoService.getBrokerPayouts(this.brokerId).subscribe({
    next: (res) => {
      if (res.status && res.innerData?.requests) {
        this.payouts = res.innerData.requests.map((r: any) => ({
        id: r.id,
        amount: r.amount,
        status: this.mapStatus(r.transactionStatus),
        date: r.createdAt,
        bankAccountNumber: r.bankAccountNumber,
        bankAccountName: r.bankAccountName,
        bankName: r.bankName
      }));
      }
    },
    error: (err) => console.error('Error loading payouts:', err)
  });
}


// لتحويل status من رقم لكلمة مفهومة
mapStatus(status: any): string {
  const s = Number(status);
  switch (s) {
    case 1:
      return 'Pending';
    case 2:
      return 'Approved';
    default:
      return 'Rejected';
  }
}

submitWithdrawRequest(): void {
  if (!this.withdrawAmount || this.withdrawAmount <= 0) {
    Swal.fire({
      icon: 'warning',
      title: this._coreTranslationService.translator.instant('PAYOUTS.INVALID_AMOUNT'),
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  const body = {
    receiverId: this.brokerId,
    amount: this.withdrawAmount
  };

  this.brokerInfoService.createWithdrawRequest(body).subscribe({
    next: (res) => {
      if (res.status) {
        Swal.fire({
          icon: 'success',
          title: this._coreTranslationService.translator.instant('PAYOUTS.SUCCESS'),
          showConfirmButton: false,
          timer: 2000
        });

        this.showRequestInput = false;
        this.withdrawAmount = null;
        this.loadPayouts();
      }
    },
    error: (err) => {
      console.error('Withdraw error:', err);
      Swal.fire({
        icon: 'error',
        title: this._coreTranslationService.translator.instant('PAYOUTS.ERROR'),
        text: err.error?.message || '',
        confirmButtonColor: '#d33'
      });
    }
  });
}
activateWithdraw(row: any): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to approve this withdrawal request?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, approve it!',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      this.brokerInfoService.processWithdrawRequest(row.id).subscribe({
        next: (res) => {
          if (res.status) {
            Swal.fire({
              icon: 'success',
              title: 'Request approved successfully',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadPayouts(); // نرجّع التحديث بعد العملية
          }
        },
        error: (err) => {
          console.error('Error processing request:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed to approve request',
            text: err.error?.message || '',
          });
        }
      });
    }
  });
}
confirmDelete(row: any): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This payout request will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d'
  }).then((result) => {
    if (result.isConfirmed) {
      this.brokerInfoService.deleteBrokerPayouts(row.id).subscribe({
        next: (res) => {
          if (res.status) {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The payout request has been deleted.',
              showConfirmButton: false,
              timer: 1500
            });
            this.loadPayouts(); // 🔄 تحديث القائمة
          }
        },
        error: (err) => {
          console.error('Delete error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: err.error?.message || 'Something went wrong while deleting.',
          });
        }
      });
    }
  });
}

}
