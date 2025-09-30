import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BrokerService } from '../broker.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CoreTranslationService } from '@core/services/translation.service';
import { CoreConfigService } from '@core/services/config.service';
import { PermissionListService } from '../../permissions/permission-list.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { locale as english } from '../i18n/en';
import { locale as arabic } from '../i18n/ar';
@Component({
  selector: 'app-brokers-list',
  templateUrl: './brokers-list.component.html',
  styleUrls: ['./brokers-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BrokersListComponent implements OnInit {

  @Input() hasHeader: boolean = true;
  @Input() hasActions: boolean = true;

  public rows: any[];
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = '';
  public isLoading = true;
  public locale: any;

  private tempData = [];

  @ViewChild(DatatableComponent) table: DatatableComponent;



constructor(
  private _coreConfigService: CoreConfigService,
  private _brokerService: BrokerService,
  private router: Router,
  private _coreTranslationService: CoreTranslationService,
  private _permissionListService: PermissionListService
) {
  this._coreTranslationService.translate(english, arabic);
}

  async ngOnInit() {
    await this.getRows();
    this._coreConfigService.config.subscribe(config => {
      this.locale = config.app.appLanguage;
    });
  }

  async getRows() {
    await this._brokerService.getDataTableRows().then(response => {
      this.isLoading = false;
      if (response.status) {
        this.rows = response.innerData;
        this.tempData = this.rows;
      } else {
        this.showAlert(response.message, false);
      }
    });
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempData.filter(d => {
      return d.user.firstName.toLowerCase().indexOf(val) !== -1 ||
             d.user.lastName.toLowerCase().indexOf(val) !== -1 ||
             d.user.email.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  addItem() {
    this.router.navigate([`/users/brokers/list/new`]);
  }

  editItem(row: any) {
  this.router.navigate([`/users/brokers/list/new/${row.user.id}`]);
}

  async deleteItem(id: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this action!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    customClass: {
      confirmButton: 'btn btn-danger',
      cancelButton: 'btn btn-outline-secondary ml-1'
    },
    buttonsStyling: false
  }).then(async (result) => {
    if (result.isConfirmed) {
      this.isLoading = true;
      await this._brokerService.deleteItem(id).then((response: any) => {
        this.isLoading = false;
        if (response.status) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Broker deleted successfully',
            customClass: { confirmButton: 'btn btn-success' }
          });
          this.getRows();
        } else {
          this.showAlert(response.message, false);
        }
      });
    }
  });
}


  showAlert(message: string, isSuccess: boolean) {
    Swal.fire({
      title: isSuccess ? 'SUCCESS' : 'FAILED',
      text: message,
      icon: isSuccess ? 'success' : 'error',
      customClass: { confirmButton: 'btn btn-success' }
    });
  }
}
