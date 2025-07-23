import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionListService } from '../permission-list.service';


@Component({
  selector: 'app-permission-preview',
  templateUrl: './permission-preview.component.html',
  styleUrls: ['./permission-preview.service.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PermissionPreviewComponent implements OnInit, OnDestroy {
  // public
  public apiData;
  public urlLastValue;
  public url = this.router.url;
  public sidebarToggleRef = false;
  public paymentSidebarToggle = false;
  public paymentDetails = {
    totalDue: '$12,110.55',
    bankName: 'American Bank',
    country: 'United States',
    iban: 'ETD95476213874685',
    swiftCode: 'BR91905'
  };

  // private
  // private _unsubscribeAll: Permission<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private router: Router,
    private _permissionPreviewService: PermissionListService,
  ) {
    // this._unsubscribeAll = new Permission();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // this._permissionPreviewService.onInvoicPreviewChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.apiData = response;
    // });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    // this._unsubscribeAll.next();
    // this._unsubscribeAll.complete();
  }
}
