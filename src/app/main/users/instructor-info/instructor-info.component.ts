import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreTranslationService } from '@core/services/translation.service';
import { InstructorsListService } from '../instructors/instructors-list.service';
import { locale as english } from './i18n/en';
import { locale as arabic } from './i18n/ar';
import feather from 'feather-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-instructor-info',
  templateUrl: './instructor-info.component.html',
  styleUrls: ['./instructor-info.component.scss']
})
export class InstructorInfoComponent implements OnInit, AfterViewInit {
public userId: number | null = null;
  public isLoading = true;
  public instructorId: string = '0';
  public instructorData: any;
  public statistics: any;
  public paidCourses: any[] = [];
  sessionPurchases: any[] = [];
  payouts: any[] = [];
    currency: string = '';
showRequestInput = false;
withdrawAmount: number | null = null;
  public currentUser: any = JSON.parse(localStorage.getItem('userType'));

  constructor(
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService,
    private _instructorsListService: InstructorsListService
  ) {
    // تحميل ملفات الترجمة (إنجليزي + عربي)
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
  // نجيب الـ instructorId من الـ URL (اللي بيكون /info/:id)
  this.route.params.subscribe(params => {
    this.instructorId = params['id'];
    console.log('📘 Instructor ID from route:', this.instructorId);
  });

  // نجيب الـ userId اللي جاي كـ query param (من viewItem)
  this.route.queryParams.subscribe(q => {
    this.userId = q['userId'];
    console.log('✅ User ID from query:', this.userId);
  });

  // استدعاءات البيانات
  setTimeout(() => {
    if (this.instructorId) {
      this.getInstructor(this.instructorId);
      this.getStatistics(this.instructorId);
      this.loadPaidCourses(this.instructorId);
      this.loadSessionPurchases(this.instructorId);
      this.loadPayouts();
    }
  }, 300);
}


  ngAfterViewInit() {
    feather.replace();
  }

async getInstructor(id: string) {
  this.isLoading = true;
  console.log('Fetching instructor with ID:', id);

  await this._instructorsListService.getItem(id).then(async (response: any) => {
    this.isLoading = false;
    console.log('📦 Raw instructor response:', response);

    // ✅ الحالة الأولى: البيانات صحيحة
    if (response.status && response.innerData) {
      this.instructorData = response.innerData;
      this.instructorId = response.innerData.id;

      if (response.innerData.user?.id) {
        this.userId = response.innerData.user.id;
        console.log('👤 Extracted userId:', this.userId);
        this.loadPayouts();
      } else {
        console.warn('⚠️ Instructor has no linked user object!');
      }

    } 
    // ⚠️ الحالة الثانية: الـ innerData null (نستعمل userId بدل id)
    else if (this.userId) {
      console.warn('⚠️ Instructor data is null. Retrying with userId:', this.userId);

      await this._instructorsListService.getItem(this.userId.toString()).then((res2: any) => {
        console.log('📦 Retried with userId response:', res2);

        if (res2.status && res2.innerData) {
          this.instructorData = res2.innerData;
          this.instructorId = res2.innerData.id;
        } else {
          this.showAlert(res2.message || 'Instructor not found', false);
        }
      });

    } else {
      console.warn('⚠️ Instructor data is null or invalid, and no userId found:', response);
      this.showAlert(response.message || 'Instructor not found', false);
    }
  });
}
  async getStatistics(id: string) {
    await this._instructorsListService.getStatistics(id).then((res: any) => {
      if (res.status) {
        this.statistics = res.innerData;
        setTimeout(() => feather.replace(), 0);
      } else {
        this.showAlert(res.message, false);
      }
    });
  }

  showAlert(message: string, isSuccess: boolean) {
    Swal.fire({
      title: isSuccess
        ? this._coreTranslationService.translator.instant('SUCCESS')
        : this._coreTranslationService.translator.instant('FAILD'),
      text: message,
      icon: isSuccess ? 'success' : 'error',
      customClass: { confirmButton: 'btn btn-success' }
    });
  }

//   async loadPaidCourses(id: string) {
//   await this._instructorsListService.getPaidCourses(id).then((res: any) => {
//     if (res.status) {
//       this.paidCourses = res.innerData;
//     } else {
//       this.paidCourses = [];
//     }
//   });
// }
async loadPaidCourses(id: string) {
  await this._instructorsListService.getTeacherCoursePurchases(id).then((res: any) => {
    if (res.status && res.innerData?.transactions) {
      // استخرج بيانات الكورسات من كل transaction
      this.paidCourses = res.innerData.transactions.map((t: any) => ({
        nameAr: t.studentcourse?.course?.nameAr,
        nameEn: t.studentcourse?.course?.nameEn,
        price: t.studentcourse?.course?.price,
        currency: t.currency,
        infoAr: t.studentcourse?.course?.infoAr,
        infoEn: t.studentcourse?.course?.infoEn,
        stage: t.studentcourse?.course?.stage,
        educationalportal: t.studentcourse?.course?.educationalportal,
        student: t.studentcourse?.student?.user,
        amount: t.amount,
        createdDate: t.createdDate
      }));
    } else {
      this.paidCourses = [];
    }
  });
}
async loadSessionPurchases(id: string) {
  await this._instructorsListService.getTeacherSessionPurchases(id).then((res: any) => {
    if (res.status && res.innerData?.transactions) {
      this.sessionPurchases = res.innerData.transactions.map((t: any) => ({
        title: t.livesession?.title,
        student: t.livesession?.student?.user,
        stageId: t.livesession?.stageId,
        subjectId: t.livesession?.subjectId,
        amount: t.amount,
        currency: t.currency,
        createdDate: t.createdDate,
        status: t.livesession?.status
      }));
    } else {
      this.sessionPurchases = [];
    }
  });
}
toggleRequestInput(): void {
  this.showRequestInput = !this.showRequestInput;
}

loadPayouts(): void {
  if (!this.userId) {
    console.warn('⚠️ Cannot load payouts — userId is missing');
    return;
  }

  this._instructorsListService.getBrokerPayouts(this.userId).subscribe({
    next: (res: any) => {
      console.log('💰 Raw payouts response:', res);
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
      } else {
        this.payouts = [];
      }
    },
    error: (err) => console.error('❌ Error loading payouts:', err)
  });
}

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

submitWithdrawRequest() {
  if (!this.userId || !this.withdrawAmount) {
    this.showAlert('Receiver ID and a valid amount are required.', false);
    return;
  }

  const body = {
    receiverId: this.userId,
    amount: this.withdrawAmount
  };

  this._instructorsListService.createWithdrawRequest(body).subscribe({
    next: (response) => {
      if (response.status) {
        Swal.fire({
          icon: 'success',
          title: 'تم الإرسال بنجاح!',
          text: 'تم إرسال طلب السحب.',
          confirmButtonColor: '#3085d6',
          timer: 2000,
          showConfirmButton: false
        });

        // ✅ بعد النجاح، نضيف الطلب الجديد فورًا في الجدول بدون إعادة تحميل الصفحة
        const newRequest = {
          id: response.innerData?.id || Math.floor(Math.random() * 100000), // مؤقت لو السيرفر مش بيرجع ID
          amount: this.withdrawAmount,
          status: 'Pending',
          date: new Date(),
          bankAccountNumber: response.innerData?.bankAccountNumber || '-',
          bankAccountName: response.innerData?.bankAccountName || '-',
          bankName: response.innerData?.bankName || '-'
        };

        // ضيف الطلب الجديد في بداية الليستة
        this.payouts = [newRequest, ...this.payouts];

        // فضي الخانات
        this.withdrawAmount = null;
        this.showRequestInput = false;
      } else {
        this.showAlert(response.message || 'فشل في إرسال الطلب.', false);
      }
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'خطأ!',
        text: err.error?.message || 'حدث خطأ أثناء إرسال الطلب.',
        confirmButtonColor: '#d33',
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
      this._instructorsListService.processWithdrawRequest(row.id).subscribe({
        next: (res: any) => {
          if (res.status) {
            Swal.fire({
              icon: 'success',
              title: 'Request approved successfully',
              timer: 1500,
              showConfirmButton: false
            });

            // ✅ 1. عدّل حالة الطلب مباشرة في الجدول
            row.status = 'Approved';

            // ✅ 2. خصم المبلغ من Wallet Balance في الـ Overview
            if (this.statistics && this.statistics.totalWalletBalance != null) {
              const currentBalance = Number(this.statistics.totalWalletBalance);
              const deduction = Number(row.amount);
              this.statistics.totalWalletBalance = Math.max(currentBalance - deduction, 0);
            }

            // ✅ 3. تحديث الأيقونات والـ UI
            setTimeout(() => feather.replace(), 0);
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed to approve request',
            text: err.error?.message || ''
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
      this._instructorsListService.deleteBrokerPayouts(row.id).subscribe({
        next: (res: any) => {
          if (res.status) {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              timer: 1500,
              showConfirmButton: false
            });
            this.loadPayouts();
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: err.error?.message || 'Something went wrong.'
          });
        }
      });
    }
  });
}

}
