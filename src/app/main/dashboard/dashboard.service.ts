import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/types/api-result';

@Injectable({ providedIn: 'root' })
export class DashboardService extends ApiService {

  public routeEndPoint: string = 'dashboard';

  /**
   * Constructor 
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
    private _toastrService: ToastrService
  ) {
    super(_httpClient, _toastrService);
  }

  getOrganizationStatistics(): Promise<ApiResult<any>> {
    return this.getResponse(`${this.routeEndPoint}/organization-statistics`);
  }

  getEnrollmentStatistics(): Promise<ApiResult<any>> {
    return this.getResponse(`${this.routeEndPoint}/enrollment-statistics`);
  }

  getInstructorStatistics(): Promise<ApiResult<any>> {
    return this.getResponse(`${this.routeEndPoint}/instructor-statistics`);
  }

  getCourseStatistics(): Promise<ApiResult<any>> {
    return this.getResponse(`${this.routeEndPoint}/course-statistics`);
  }

  getBestSellingCourse(): Promise<ApiResult<any>> {
    return this.getResponse(`${this.routeEndPoint}/best-selling-course`);
  }

  getOrgCurrentBalance(centerId: number): Promise<ApiResult<any>> {
    return this.getResponse(`${this.routeEndPoint}/org-current-balance?centerId=${centerId}`);
  }

  getOrgTotalCourses(centerId: number): Promise<ApiResult<any>> {
    return this.getResponse(`${this.routeEndPoint}/org-courses-statistics?centerId=${centerId}`)
  }

  getOrgTotalInstructor(centerId: number): Promise<ApiResult<any>> {
    return this.getResponse(`${this.routeEndPoint}/org-instructor-statistics?centerId=${centerId}`)
  }

  getOrgTotalStudents(centerId: number): Promise<ApiResult<any>> {
    return this.getResponse(`${this.routeEndPoint}/org-student-statistics?centerId=${centerId}`)
  }

  getDashboardStatistics(): Promise<ApiResult<any>> {
  return this.getResponse(`${this.routeEndPoint}/statistics`);
}

}
