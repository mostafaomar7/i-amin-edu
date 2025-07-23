import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { first } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';

import { colors } from 'app/colors.const';
import { User } from 'app/auth/models';
import { UserService } from 'app/auth/service';
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
  
  // Decorator
  @ViewChild('gainedChartRef') gainedChartRef: any;
  @ViewChild('orderChartRef') orderChartRef: any;
  @ViewChild('avgSessionChartRef') avgSessionChartRef: any;
  @ViewChild('supportChartRef') supportChartRef: any;
  @ViewChild('salesChartRef') salesChartRef: any;

  // Public
  public data: any;
  public currentUser: any;
  public loading = false;
  public users: User[] = [];
  public gainedChartoptions;
  public orderChartoptions;
  public avgsessionChartoptions;
  public supportChartoptions;
  public salesChartoptions;
  public isMenuToggled = true;
  
  public organizations;
  public totalInstructors;
  public totalCourses;
  public enrollment;

  public totalOrganizationsOverYear;
  public totalInstructorOverYear;
  public totalCoursesOverYear;
  public totalEnrollmentOverYear;


  // Private
  private $primary = '#7367F0';
  private $warning = '#FF9F43';
  private $info = '#00cfe8';
  private $info_light = '#1edec5';
  private $strok_color = '#b9c3cd';
  private $label_color = '#e7eef7';
  private $white = '#fff';
  private $textHeadingColor = '#FF5888';

  /**
   * Constructor
   *
   * @param {DashboardService} _dashboardService
   * @param {CoreConfigService} _coreConfigService
   *
   */
  constructor(
    private _dashboardService: DashboardService,
    private _coreConfigService: CoreConfigService,
    private _coreTranslationService: CoreTranslationService

  ) {
    this._coreTranslationService.translate(english, arabic);


     // Total Enrollment
     this.enrollment = {
      series: [{
        name: "Enrollments",
        data: [0]
      }],
      chart: {
        height: 200,
        type: 'area',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2.5
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
       },
       colors: [this.$warning]
    };

    // Organizations
    this.organizations = {
      series: [{
        name: "Organizations",
        data: [10, 41, 3, 51, 100, 62, 20, 91, 148]
      }],
      chart: {
        height: 200,
        type: 'area',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2.5
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
       },
      colors: [this.$textHeadingColor]
    };


    // Total Instructors
    this.totalInstructors = {
      series: [{
        name: "Total Instructors",
        data: [10, 41, 3, 51, 0, 62, 20, 91, 148]
      }],
      chart: {
        height: 200,
        type: 'area',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2.5
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
       },
      colors: [this.$strok_color]
    };

    // Total Courses
     this.totalCourses = {
      series: [{
        name: "Total Instructors",
        data: [0, 41, 0, 51, 0, 62, 20, 91, 0]
      }],
      chart: {
        height: 200,
        type: 'area',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2.5
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
       },
       colors: [this.$info]
     };
    
   

    // Order Received Chart
    this.orderChartoptions = {
      chart: {
        height: 100,
        type: 'area',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      colors: [this.$warning],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2.5
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.9,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 80, 100]
        }
      },
      series: [
        {
          name: 'Orders',
          data: [10, 15, 8, 15, 7, 12, 8]
        }
      ],
      tooltip: {
        x: { show: false }
      }
    };

    // Average Session Chart
    this.avgsessionChartoptions = {
      chart: {
        type: 'bar',
        height: 200,
        sparkline: { enabled: true },
        toolbar: { show: false }
      },
      colors: [
        this.$label_color,
        this.$label_color,
        this.$primary,
        this.$label_color,
        this.$label_color,
        this.$label_color
      ],
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
          endingShape: 'rounded'
        }
      },
      tooltip: {
        x: { show: false }
      }
    };

    // Support Tracker Chart
    this.supportChartoptions = {
      chart: {
        height: 290,
        type: 'radialBar',
        sparkline: {
          enabled: false
        }
      },
      plotOptions: {
        radialBar: {
          offsetY: 20,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: '65%'
          },
          track: {
            background: this.$white,
            strokeWidth: '100%'
          },
          dataLabels: {
            name: {
              offsetY: -5,
              color: this.$textHeadingColor,
              fontSize: '1rem'
            },
            value: {
              offsetY: 15,
              color: this.$textHeadingColor,
              fontSize: '1.714rem'
            }
          }
        }
      },
      colors: [colors.solid.danger],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: [colors.solid.primary],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        dashArray: 8
      },
      labels: ['Completed Tickets']
    };

    // Sales Chart
    this.salesChartoptions = {
      chart: {
        height: 330,
        type: 'radar',
        dropShadow: {
          enabled: true,
          blur: 8,
          left: 1,
          top: 1,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      stroke: {
        width: 0
      },
      colors: [this.$primary, this.$info],
      plotOptions: {
        radar: {
          polygons: {
            connectorColors: 'transparent'
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#9f8ed7', this.$info_light],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      markers: {
        size: 0
      },
      legend: {
        show: false
      },
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      dataLabels: {
        style: {
          colors: [
            this.$strok_color,
            this.$strok_color,
            this.$strok_color,
            this.$strok_color,
            this.$strok_color,
            this.$strok_color
          ]
        }
      },
      yaxis: {
        show: false
      }
    };
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // get the currentUser details from localStorage
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    /**
     * Get the secure api service (based on user role) (Admin Only secure API)
     * For example purpose
     */

    // Get the dashboard service data
    // this._dashboardService.onApiDataChanged.subscribe(response => {
    //   this.data = response;
    // });

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
  }

  /**
   * After View Init
   */
  ngAfterViewInit() {
    // Subscribe to core config changes
    this._coreConfigService.getConfig().subscribe(config => {
      // If Menu Collapsed Changes
      if (config.layout.menu.collapsed === true || config.layout.menu.collapsed === false) {
        setTimeout(() => {
          // Get Dynamic Width for Charts
          this.isMenuToggled = false;
          // this.gainedChartoptions.chart.width = this.gainedChartRef?.nativeElement.offsetWidth;
          // this.orderChartoptions.chart.width = this.orderChartRef?.nativeElement.offsetWidth;
          // this.avgsessionChartoptions.chart.width = this.avgSessionChartRef?.nativeElement.offsetWidth;
          // this.supportChartoptions.chart.width = this.supportChartRef?.nativeElement.offsetWidth;
          // this.salesChartoptions.chart.width = this.salesChartRef?.nativeElement.offsetWidth;
        }, 1000);
      }
    });
  }
}
