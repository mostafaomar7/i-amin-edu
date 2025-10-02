import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/types/api-result';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class InstructorsListService extends ApiService {

  public routeEndPoint: string = 'teacher';

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


}
