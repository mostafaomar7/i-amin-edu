import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { CourseListService } from '../course-list.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from 'app/main/apps/courses/i18n/en';
import { locale as arabic } from 'app/main/apps/courses/i18n/ar';
import { CoreConfigService } from '@core/services/config.service';
import { PermissionListService } from 'app/main/users/permissions/permission-list.service';
import { Role } from 'app/auth/models';

@Component({
    selector: 'app-course-list',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CourseListComponent implements OnInit {


    @Input() selectedCenterId: number = 0;
    @Input() isBestSelling: boolean = false;
    @Input() hasHeader: boolean = true;
    @Input() hasActions: boolean = true;


    // Public
    public rows;
    public selectedOption = 10;
    public ColumnMode = ColumnMode;
    public temp = [];
    public searchValue = '';
    public isLoading = true;
    public currentRow: any;
    public locale: any;

    // Decorator
    @ViewChild(DatatableComponent) table: DatatableComponent;

    // Private
    private tempData = [];


    /**
     * Constructor
     *
     * @param {CoreConfigService} _coreConfigService
     * @param {courseListService} _courseListService
     */
    constructor(
        private _coreConfigService: CoreConfigService,
        private _courseListService: CourseListService,
        private router: Router,
        private _coreTranslationService: CoreTranslationService,
        private _permissionListService: PermissionListService
    ) {
        this._coreTranslationService.translate(english, arabic);
        this._permissionListService.getMyPermissions();
    }

    // Lifecycle Hooks
    /**
     * On init
     */
    async ngOnInit() {
        await this.getRows();

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
        const courseName = d.nameEn?.toLowerCase() || '';
        const teacherFirst = d.teacher?.user?.firstName?.toLowerCase() || '';
        const teacherLast = d.teacher?.user?.lastName?.toLowerCase() || '';
        const teacherFull = `${teacherFirst} ${teacherLast}`.trim();

        // ابحث بالاسم أو باسم المدرس (الأول أو الأخير أو الكامل)
        return (
            courseName.includes(val) ||
            teacherFirst.includes(val) ||
            teacherLast.includes(val) ||
            teacherFull.includes(val) ||
            !val
        );
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
                await this.deleteItem(id);
            }
        });
    }

    /**
     * Handle Api's Calls
     */
    async getRows() {
    let centerId = 0;
    let teacherId = null;

    switch (this._permissionListService.getRoleType()) {
        case Role.Admin:
            centerId = this.selectedCenterId;
            break;
        default:
            teacherId = JSON.parse(localStorage.getItem('userData')).id;
            break;
    }

    this._courseListService.getDataTableRows(1, 1000).then(response => {
        this.isLoading = false;
        if (response.status) {
            this.rows = response.innerData;
            this.tempData = this.rows;
                  console.log('courses length:', response.innerData.length);
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
        this.router.navigate([`/apps/courses/list/new`]);
    }

    viewItem(row: any) {
        // this.router.navigate([`/apps/courses/list/view`]);
        this.router.navigate(['/apps/courses/list/view'], { queryParams: { id: row.id } });
    }


    editItem(row: any) {
        this.router.navigate([`/apps/courses/list/new/${row.id}`]);
    }

    deleteItem(id: string) {
        this.isLoading = true;
        this._courseListService.deleteItem(id).then((response: any) => {
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
                this.getRows();
            } else {
                this.ConfirmColorOpen(response.message, false);
            }
        });
    }

}
