import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/types/api-result';

import { ToastrService } from 'ngx-toastr';

@Injectable()
export class CourseListService extends ApiService {

  public routeEndPoint: string = 'course';

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
  getDataTableRows(page: number = 1, limit: number = 1000): Promise<ApiResult<any>> {
  let query = `page=${page}&limit=${limit}`;
  return this.getResponse(`${this.routeEndPoint}/all?${query}`);
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

  uploadVimeoVideo(file: File): Promise<ApiResult<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.postVimeoDataResponse(formData);
  }

  uploadVideo(file: File): Promise<ApiResult<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.postMultiDataResponse(`vimeo`, formData);
  }

//   async uploadVideoApiVideo(file: File, courseId: number, classType: number): Promise<string | null> {
//     try {
//         const tokenResponse = await this.getApiVideoUploadToken<any>();
//         if (!tokenResponse.status) throw new Error(tokenResponse.message);

//         const uploadUrl = tokenResponse.innerData.uploadUrl;
//         const uploadResponse = await this.uploadToApiVideo<any>(uploadUrl, file);
//         if (!uploadResponse.status) throw new Error(uploadResponse.message);

//         const videoId = uploadResponse.innerData.videoId;

//         const meta = {
//             videoId,
//             title: file.name,
//             courseId,
//             classType,
//         };

//         const saveResponse = await this.saveApiVideoMetadata<any>(meta);
//         if (!saveResponse.status) throw new Error(saveResponse.message);

//         return videoId;
//     } catch (err) {
//         this._toastrService.error(err.message || 'Video upload failed');
//         return null;
//     }
// }

}
