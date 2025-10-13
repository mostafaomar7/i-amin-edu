import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/types/api-result';
import { environment } from 'environments/environment';

import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorsListService extends ApiService {

  public routeEndPoint: string = 'teacher';
  private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('authToken');
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
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

  /**
   * Get List
   */
  getDataTableRows(centerId: any): Promise<ApiResult<any>> {
    return this.getResponse(`${this.routeEndPoint}/all?centerId=${centerId}`);
  }

  /**
   * Add New Item
   */
  addItem(request: any): Promise<ApiResult<any>> {
    return this.postResponse(`${this.routeEndPoint}/create`, request);
  }

  /**
   * Upate Item
   */
  updateItem(request: any): Promise<ApiResult<any>> {
    return this.putResponse(`${this.routeEndPoint}/update`, request);
  }

  /**
   * Delete Item
   */
  deleteItem(id: string): Promise<ApiResult<any>> {
    return this.deleteResponse(`${this.routeEndPoint}/${id}`);
  }

  /**
   * Get Item
   */
  getItem(id: string): Promise<ApiResult<any>> {
    return this.getResponse(`${this.routeEndPoint}/${id}`);
  }

  /**
   * Upload Image
   */
  uploadImage(file: File): Promise<ApiResult<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.postMultiDataResponse(`upload-media`, formData);
  }
  getStatistics(id: string): Promise<ApiResult<any>> {
  return this.getResponse(`dashboard/statistics/${id}`);
}
// getPaidCourses(teacherId: string): Promise<ApiResult<any>> {
//   return this.getResponse(`course/teacher/${teacherId}/paid`);
// }
getTeacherCoursePurchases(teacherId: string): Promise<ApiResult<any>> {
  return this.getResponse(`transaction-history/teacher/${teacherId}/course-purchases`);
}
getTeacherSessionPurchases(teacherId: string): Promise<ApiResult<any>> {
  return this.getResponse(`transaction-history/teacher/${teacherId}/session-purchases`);
}
getBrokerPayouts(userId: number) {
  return this.http.get<any>(
    `${environment.apiUrl}/transaction-history/withdraw/requests/${userId}`,
    { headers: this.getHeaders() }
  );
} 

createWithdrawRequest(body: any) {
  return this.http.post<any>(`${environment.apiUrl}/transaction-history/withdraw/request`, body, {
    headers: this.getHeaders()
  });
}

processWithdrawRequest(id: number) {
  return this.http.post<any>(`${environment.apiUrl}/transaction-history/withdraw/process/${id}`, {}, {
    headers: this.getHeaders()
  });
}

deleteBrokerPayouts(id: number) {
  return this.http.delete<any>(`${environment.apiUrl}/transaction-history/withdraw/requests/${id}`, {
    headers: this.getHeaders()
  });
}

}
