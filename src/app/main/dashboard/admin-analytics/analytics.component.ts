import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { CoreConfigService } from '@core/services/config.service';

import { colors } from 'app/colors.const';
import { User } from 'app/auth/models';
import { DashboardService } from 'app/main/dashboard/dashboard.service';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from '../i18n/en';
import { locale as arabic } from '../i18n/ar';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnalyticsComponent implements OnInit {
  
  @ViewChild('gainedChartRef') gainedChartRef: any;

  public currentUser: any;
  public loading = false;

  public enrollment;
  public organizations;
  public totalInstructors;
  public totalCourses;

  public totalEnrollmentOverYear = 0;
  public totalOrganizationsOverYear = 0;
  public totalInstructorOverYear = 0;
  public totalCoursesOverYear = 0;

  // Chart Colors
  private $warning = '#FF9F43';
  private $textHeadingColor = '#FF5888';
  private $strok_color = '#b9c3cd';
  private $info = '#00cfe8';

  constructor(
    private _dashboardService: DashboardService,
    private _coreConfigService: CoreConfigService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);

    this.initCharts();
  }
   public data: any = null;

  public totalCoursesChart: any;
  public totalEnrollmentsChart: any;
  public walletBalanceChart: any;
  ngOnInit(): void {
   
    // get the currentUser details from localStorage
    this.currentUser = JSON.parse(localStorage.getItem('userType'));

    this._dashboardService.getEnrollmentStatistics().then(response => {
      this.loading = false;
      if (response.status) {
        this.totalEnrollmentOverYear = response.innerData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        this.enrollment.series = [{
          name: "Enrollment",
          data: response.innerData
        }]
      }
    });

    this._dashboardService.getOrganizationStatistics().then(response => {
      this.loading = false;
      if (response.status) {
        this.totalOrganizationsOverYear = response.innerData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        this.organizations.series = [{
          name: "Organization",
          data: response.innerData
        }]
      }
    });

    this._dashboardService.getInstructorStatistics().then(response => {
      this.loading = false;
      if (response.status) {
        this.totalInstructorOverYear = response.innerData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        this.totalInstructors.series = [{
          name: "Total Instructors",
          data: response.innerData
        }]
      }
    });

    this._dashboardService.getCourseStatistics().then(response => {
      this.loading = false;
      if (response.status) {
        this.totalCoursesOverYear = response.innerData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        this.totalCourses.series = [{
          name: "Total Courses",
          data: response.innerData
        }]
      }
    });
  
     this._dashboardService.getDashboardStatistics().then(response => {
  if (response.status) {
    this.data = response.innerData;

    const totalConsultations = this.data?.totalConsultations ?? 0;
    this.consultationsChart.series = [{
      name: "Consultations",
      data: [0, totalConsultations] 
    }];

    const totalCourses = this.data?.totalCourses ?? 0;
    this.courses.series = [{
      name: "Courses",
      data: [0, totalCourses] 
    }];

    const totalEnrollments = this.data?.totalEnrollments ?? 0;
    this.totalEnrollments.series = [{
      name: "Courses",
      data: [0, totalEnrollments] 
    }];

    const wallet = this.data?.totalWalletBalance ;
    this.walletBalance.series = [{
      name: "walletBalance",
      data: [0, wallet] 
    }];

  }
    });
    
  }
public consultationsChart: any;
public courses: any;
public totalEnrollments: any;
public walletBalance: any;

  initCharts() {
    this.enrollment = {
      series: [{ name: "Enrollments", data: [0] }],
      chart: { height: 200, type: 'area', toolbar: { show: false }, sparkline: { enabled: false }},
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2.5 },
      fill: { opacity: 1 },
      tooltip: { x: { format: 'dd/MM/yy HH:mm' }},
      colors: [this.$warning]
    };

    this.organizations = {
      series: [{ name: "Organizations", data: [0] }],
      chart: { height: 200, type: 'area', toolbar: { show: false }, sparkline: { enabled: false }},
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2.5 },
      fill: { opacity: 1 },
      tooltip: { x: { format: 'dd/MM/yy HH:mm' }},
      colors: [this.$textHeadingColor]
    };

    this.totalInstructors = {
      series: [{ name: "Total Instructors", data: [0] }],
      chart: { height: 200, type: 'area', toolbar: { show: false }, sparkline: { enabled: false }},
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2.5 },
      fill: { opacity: 1 },
      tooltip: { x: { format: 'dd/MM/yy HH:mm' }},
      colors: [this.$strok_color]
    };

    this.totalCourses = {
      series: [{ name: "Total Courses", data: [0] }],
      chart: { height: 200, type: 'area', toolbar: { show: false }, sparkline: { enabled: false }},
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2.5 },
      fill: { opacity: 1 },
      tooltip: { x: { format: 'dd/MM/yy HH:mm' }},
      colors: [this.$info]
    };
    this.consultationsChart = {
      series: [{ name: "Consultations", data: [0] }],
      chart: {
        height: 200,
        type: 'area',
        toolbar: { show: false },
        sparkline: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2.5 },
      fill: { opacity: 1 },
      tooltip: { x: { format: 'dd/MM/yy HH:mm' } },
      colors: ['#c5e416ff']
    };
    this.courses = {
      series: [{ name: "Courses", data: [0] }],
      chart: {
        height: 200,
        type: 'area',
        toolbar: { show: false },
        sparkline: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2.5 },
      fill: { opacity: 1 },
      tooltip: { x: { format: 'dd/MM/yy HH:mm' } },
      colors: ['#18df92ff']
    };
    this.totalEnrollments = {
      series: [{ name: "Total Enrollments", data: [0] }],
      chart: {
        height: 200,
        type: 'area',
        toolbar: { show: false },
        sparkline: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2.5 },
      fill: { opacity: 1 },
      tooltip: { x: { format: 'dd/MM/yy HH:mm' } },
      colors: ['#7367F0']
    };
    this.walletBalance = {
      series: [{ name: "Wallet Balance", data: [0] }],
      chart: {
        height: 200,
        type: 'area',
        toolbar: { show: false },
        sparkline: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2.5 },
      fill: { opacity: 1 },
      tooltip: { x: { format: 'dd/MM/yy HH:mm' } },
      colors: ['#db5cb9ff']
    };
  }

  private setStatsFromStorage(stats: any) {
    this.totalEnrollmentOverYear = stats.totalEnrollments || 0;
    this.totalOrganizationsOverYear = stats.totalOrganizations || 0;
    this.totalInstructorOverYear = stats.totalInstructors || 0;
    this.totalCoursesOverYear = stats.totalCourses || 0;

    // تحديث السلاسل البيانية مع بيانات الحفظ
    this.enrollment.series = [{ name: "Enrollments", data: [this.totalEnrollmentOverYear] }];
    this.organizations.series = [{ name: "Organizations", data: [this.totalOrganizationsOverYear] }];
    this.totalInstructors.series = [{ name: "Total Instructors", data: [this.totalInstructorOverYear] }];
    this.totalCourses.series = [{ name: "Total Courses", data: [this.totalCoursesOverYear] }];
  }

  private async loadStatsFromApiAndStore(saveToStorage: boolean = true) {
     console.log('loadStatsFromApiAndStore CALLED');
    this.loading = true;
    try {
      const [enrollmentRes, organizationRes, instructorRes, courseRes] = await Promise.all([
        this._dashboardService.getEnrollmentStatistics(),
        this._dashboardService.getOrganizationStatistics(),
        this._dashboardService.getInstructorStatistics(),
        this._dashboardService.getCourseStatistics()
      ]);

      if (enrollmentRes.status) {
      console.log('Enrollment chart data:', enrollmentRes.innerData);

        this.totalEnrollmentOverYear = enrollmentRes.innerData.reduce((acc, val) => acc + val, 0);
        this.enrollment.series = [{ name: "Enrollments", data: enrollmentRes.innerData }];
      }

      if (organizationRes.status) {
        this.totalOrganizationsOverYear = organizationRes.innerData.reduce((acc, val) => acc + val, 0);
        this.organizations.series = [{ name: "Organizations", data: organizationRes.innerData }];
      }
      if (instructorRes.status) {
        this.totalInstructorOverYear = instructorRes.innerData.reduce((acc, val) => acc + val, 0);
        this.totalInstructors.series = [{ name: "Total Instructors", data: instructorRes.innerData }];
      }
      if (courseRes.status) {
        this.totalCoursesOverYear = courseRes.innerData.reduce((acc, val) => acc + val, 0);
        this.totalCourses.series = [{ name: "Total Courses", data: courseRes.innerData }];
      }

      if (saveToStorage) {
        const stats = {
          totalEnrollments: this.totalEnrollmentOverYear,
          totalOrganizations: this.totalOrganizationsOverYear,
          totalInstructors: this.totalInstructorOverYear,
          totalCourses: this.totalCoursesOverYear
        };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
      }
    } catch (error) {
      console.error('Error loading dashboard statistics:', error);
    } finally {
      this.loading = false;
    }
  }
}
