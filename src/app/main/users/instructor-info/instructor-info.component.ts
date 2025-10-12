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

  public isLoading = true;
  public instructorId: string = '0';
  public instructorData: any;
  public statistics: any;
  public paidCourses: any[] = [];
  sessionPurchases: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService,
    private _instructorsListService: InstructorsListService
  ) {
    // تحميل ملفات الترجمة (إنجليزي + عربي)
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getInstructor(id);
      this.getStatistics(id);
      this.loadPaidCourses(id);
      this.loadSessionPurchases(id);
    }
  }

  ngAfterViewInit() {
    feather.replace();
  }

  async getInstructor(id: string) {
    this.isLoading = true;
    await this._instructorsListService.getItem(id).then((response: any) => {
      this.isLoading = false;
      if (response.status) {
        this.instructorData = response.innerData;
        this.instructorId = response.innerData.id;
      } else {
        this.showAlert(response.message, false);
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

}
