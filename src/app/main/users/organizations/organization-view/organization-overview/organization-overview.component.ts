import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { CoreTranslationService } from '@core/services/translation.service';
import { DashboardService } from 'app/main/dashboard/dashboard.service';
import { locale as english } from 'app/main/users/organizations/i18n/en';
import { locale as arabic } from 'app/main/users/organizations/i18n/ar';
import Swal from 'sweetalert2';
import { OrganizationListService } from '../../organization-list.service';

@Component({
  selector: 'app-organization-overview',
  templateUrl: './organization-overview.component.html',
  styleUrls: ['./organization-overview.component.scss']
})
export class OrganizationOverviewComponent implements OnInit {

  public isLoading = true;
  
  public userId: any;
  public centerId: any;

  public currnetBalance = 0;
  public totalWithdrawBalance = 0;
  public instructorNumbers = 0;
  public coursesNumber = 0;
  public studentsNumber = 0;



  constructor(
    private _coreConfigService: CoreConfigService,
    private _dashbaordService: DashboardService,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService,
    private _organizationListService: OrganizationListService
  ) {
    this._coreTranslationService.translate(english, arabic);

  }

  ngOnInit(): void {

    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId != null) {
      this.userId = itemId;
    } else {
      this.userId = JSON.parse(localStorage.getItem('userData')).userId;
    }
    this.getItem(this.userId)
  }

  /**
 * Handle Api's Calls
 */


  async getItem(id: string) {
    await this._organizationListService.getItem(id).then((respone: any) => {
      this.centerId = respone.innerData.id;
      this.getCurrentBalance();
      this.getCoursesNumber();
      this.getTotalStudentNumber();
      this.getInstructorsNumber();
      this.getTotalWidhrawAmount();
    })
  }

  async getCurrentBalance() {
    await this._dashbaordService.getOrgCurrentBalance(this.centerId).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.currnetBalance = response.innerData.currentBalance;

      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async getTotalWidhrawAmount() {
    await this._dashbaordService.getOrgCurrentBalance(this.centerId).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.totalWithdrawBalance = response.innerData.currentBalance;

      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }
  async getInstructorsNumber() {
    await this._dashbaordService.getOrgTotalInstructor(this.centerId).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.instructorNumbers = response.innerData.instructorsNumber;

      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }
  async getCoursesNumber() {
    await this._dashbaordService.getOrgTotalCourses(this.centerId).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.coursesNumber = response.innerData.coursesNumber;

      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async getTotalStudentNumber() {
    await this._dashbaordService.getOrgTotalStudents(this.centerId).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.studentsNumber = response.innerData.studentsNumber;

      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }



  ConfirmColorOpen(message: string, isSuccess: boolean) {
    Swal.fire({
      title: (isSuccess) ? this._coreTranslationService.translator.instant('SUCCESS') : this._coreTranslationService.translator.instant('FAILD'),
      text: message,
      icon: (isSuccess) ? 'success' : 'error',
      customClass: {
        confirmButton: 'btn btn-success'
      }
    });
  }
}
