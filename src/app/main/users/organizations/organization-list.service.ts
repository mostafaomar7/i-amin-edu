import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/types/api-result';

import { ToastrService } from 'ngx-toastr';

@Injectable()
export class OrganizationListService extends ApiService {

  public routeEndPoint: string = 'center';

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
  getDataTableRows(): Promise<ApiResult<any>> {
    return this.getResponse(`${this.routeEndPoint}/all`);
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
  // ✅ Withdraw / Payout Requests Methods
createWithdrawRequest(data: { receiverId: number; amount: number }) {
  return this.postResponse(`transaction-history/withdraw/request`, data);
}

getOrganizationPayouts(orgId: number) {
  return this.getResponse(`transaction-history/withdraw/requests/${orgId}`);
}

processWithdrawRequest(id: number) {
  return this.postResponse(`transaction-history/withdraw/process/${id}`, {});
}

deleteOrganizationPayout(id: number) {
  return this.deleteResponse(`transaction-history/withdraw/requests/${id}`);
}
// ✅ الكورسات المدفوعة
getOrganizationCourses(centerId: number) {
  return this.getResponse(`transaction-history/organization/${centerId}/course-purchases`);
}

// ✅ السيشنز
getOrganizationSessions(centerId: number) {
  return this.getResponse(`transaction-history/organization/${centerId}/session-purchases`);
}

// ✅ المدرسين
getOrganizationInstructors(centerId: number) {
  return this.getResponse(`center/${centerId}/instructors`);
}

}
