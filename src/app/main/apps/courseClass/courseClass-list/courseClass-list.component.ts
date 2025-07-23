import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { CourseClassListService } from '../courseClass-list.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from 'app/main/apps/courseClass/i18n/en';
import { locale as arabic } from 'app/main/apps/courseClass/i18n/ar';
import { CoreConfigService } from '@core/services/config.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // <-- الخطوة 1: إضافة هذه

@Component({
  selector: 'app-courseClass-list',
  templateUrl: './courseClass-list.component.html',
  styleUrls: ['./courseClass-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CourseClassListComponent implements OnInit {

  @Input() selectedCourseId: string;
  @Input() hasHeader: boolean = true;

  // Public
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public searchValue = '';
  public isLoading = true;
  public currentRow: any;
  public locale: any;
  public playVideo = false;
  public currentVideoUrl: SafeResourceUrl; // <-- الخطوة 2: تعديل النوع هنا

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];

  /**
   * Constructor
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _courseClassListService: CourseClassListService,
    private router: Router,
    private _coreTranslationService: CoreTranslationService,
    private sanitizer: DomSanitizer // <-- الخطوة 3: إضافة هذه
  ) {
    this._coreTranslationService.translate(english, arabic);
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
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    // <-- الخطوة 4: تعديل البحث ليشمل اللغتين
    const temp = this.tempData.filter(function (d) {
      return (d.nameEn.toLowerCase().indexOf(val) !== -1 ||
              d.nameAr.toLowerCase().indexOf(val) !== -1 ||
              !val);
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
    await this._courseClassListService.getDataTableRows(this.selectedCourseId).then(response => {
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
  * Handle Navigation
  */
  // في ملف courseClass-list.component.ts

// في ملف courseClass-list.component.ts

viewItem(row: any) {
  // يمكنك حذف هذا السطر أو تركه للمستقبل
  console.log('🕵️‍♂️ البيانات التي تم الضغط عليها:', row);

  this.playVideo = !this.playVideo;
  if (this.playVideo && row) {
    // تم التعديل هنا لاستخدام الاسم الصحيح "videoId"
    const unsafeUrl = `https://embed.api.video/vod/${row.videoId}`;
    
    this.currentVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }
}

  addItem() {
    this.router.navigate(['/apps/course-class/list/new'], { queryParams: { id: this.selectedCourseId } });
  }

  editItem(row: any) {
    this.router.navigate([`/apps/course-class/list/new/${row.id}`], { queryParams: { id: this.selectedCourseId } });
  }

  deleteItem(id: string) {
    this.isLoading = true;
    this._courseClassListService.deleteItem(id).then((response: any) => {
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