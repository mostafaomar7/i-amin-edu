import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { first } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';

import { colors } from 'app/colors.const';
import { DashboardService } from 'app/main/dashboard/dashboard.service';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from '../i18n/en';
import { locale as arabic } from '../i18n/ar';

@Component({
  selector: 'org-app-analytics',
  templateUrl: './org-analytics.component.html',
  styleUrls: ['./org-analytics.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrgAnalyticsComponent implements OnInit {
  
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
  public gainedChartoptions;
  public orderChartoptions;
  public avgsessionChartoptions;
  public supportChartoptions;
  public salesChartoptions;
  public isMenuToggled = true;

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

  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // get the currentUser details from localStorage
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
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
        }, 1000);
      }
    });
  }
}
