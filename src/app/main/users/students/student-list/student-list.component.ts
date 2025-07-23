import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { StudentListService } from '../student-list.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from 'app/main/users/students/i18n/en';
import { locale as arabic } from 'app/main/users/students/i18n/ar';
import { CoreConfigService } from '@core/services/config.service';
import { PermissionListService } from '../../permissions/permission-list.service';
import { Role } from 'app/auth/models';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class StudentListComponent implements OnInit {
  // Public
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public searchValue = '';
  public isLoading = true;
  public currentRow: any;
  public locale: any;
  public isAdmin = false;

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];



  /**
   * Constructor
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _studentListService: StudentListService,
    private router: Router,
    private _coreTranslationService: CoreTranslationService,
    private _permissionListService: PermissionListService
  ) {
    this._coreTranslationService.translate(english, arabic);
    this._permissionListService.getMyPermissions()
  }

  // Lifecycle Hooks
  /**
   * On init
   */
  async ngOnInit() {
    await this.getRows()

    this._coreConfigService.config.subscribe(config => {
      this.locale = config.app.appLanguage;
    });
  }

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.user.firstName.toLowerCase().indexOf(val) !== -1 || d.user.lastName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
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

  ConfirmDelete(id: string) {
    Swal.fire({
      title: this._coreTranslationService.translator.instant('DELETE_ALERT'),
      text: this._coreTranslationService.translator.instant('WARNING'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      cancelButtonColor: '#E42728',
      cancelButtonText: this._coreTranslationService.translator.instant('CANCEL'),
      confirmButtonText: this._coreTranslationService.translator.instant('DELETE_CONFIRM'),
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    }).then(async (result) => {
      if (result.value) {
        await this.deleteItem(id)
      }
    });
  }

  /**
 * Handle Api's Calls
 */
  async getRows() {
    var centerId = 0;
    switch (this._permissionListService.getRoleType()) {
      case Role.Admin:
        this.isAdmin = true;
        centerId = 0
        break
      default:
        this.isAdmin = false
        centerId = JSON.parse(localStorage.getItem('userData')).id;
        break
    }
    await this._studentListService.getDataTableRows(centerId).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.rows = response.innerData;
        this.tempData = this.rows;
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  /**
 * 
 * Handle Navigation 
 */
  addItem() {
    this.router.navigate([`/users/students/list/new`]);
  }

  editItem(row: any) {
    this.router.navigate([`/users/students/list/new/${row.user.id}`]);
  }

  deleteItem(id: string) {
    this.isLoading = true;
    this._studentListService.deleteItem(id).then((response: any) => {
      this.isLoading = false;
      if (response.status) {
        Swal.fire({
          icon: 'success',
          title: this._coreTranslationService.translator.instant('DELETED'),
          text: this._coreTranslationService.translator.instant('DELETE_SUCCESS'),
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
        this.getRows()
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    })
  }

}