import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseListService } from '../course-list.service';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from 'app/main/apps/courses/i18n/en';
import { locale as arabic } from 'app/main/apps/courses/i18n/ar';

@Component({
  selector: 'app-course-preview',
  templateUrl: './course-preview.component.html',
  styleUrls: ['./course-preview.service.scss'],
  encapsulation: ViewEncapsulation.None
})
export class coursePreviewComponent implements OnInit, OnDestroy {

  course: any;


  // public
  public isLoading = false;
  // private

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private router: Router,
    private _coursePreviewService: CourseListService,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService,
  ) {
    this._coreTranslationService.translate(english, arabic);

  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // this._coursePreviewService.onInvoicPreviewChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.apiData = response;
    // });

    this.route.queryParams.subscribe(params => {
      const courseId = params['id'];
      this.getItem(courseId)
    });
  }

  async getItem(id: string) {
    await this._coursePreviewService.getItem(id).then((respone: any) => {
      this.course = respone.innerData
    })
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
  }
}
