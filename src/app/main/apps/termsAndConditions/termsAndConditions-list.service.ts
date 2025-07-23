import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "@core/services/api.service";
import { ApiResult } from "@core/types/api-result";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class TermsAndConditionsListService extends ApiService {
  public routeEndPoint: string = "terms-and-conditions";

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
    return this.deleteResponse(`${this.routeEndPoint}/delete/${id}`);
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
    formData.append("file", file, file.name);
    return this.postMultiDataResponse(`upload-media`, formData);
  }
}
