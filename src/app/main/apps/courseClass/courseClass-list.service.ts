import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApiService} from '@core/services/api.service';
import {ApiResult} from '@core/types/api-result';

import {ToastrService} from 'ngx-toastr';
import {VimeoService} from '../../../../@core/services/vimeo.service';

@Injectable()
export class CourseClassListService extends ApiService {

    public routeEndPoint: string = 'course-class';


    constructor(
        private _httpClient: HttpClient,
        private _toastrService: ToastrService,
        private vimeoService: VimeoService
    ) {
        super(_httpClient, _toastrService);
    }

    /**
     * Get List
     */
    getDataTableRows(id: string): Promise<ApiResult<any>> {
        return this.getResponse(`${this.routeEndPoint}/all/${id}`);
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
        formData.append('file', file, file.name);
        return this.postMultiDataResponse(`upload-media`, formData);
    }

    /**
     * Upload Video
     */
    uploadVideo(file: File): Promise<ApiResult<any>> {
    return this.postApiVideoDataResponse(file);
    }


    // Upload the selected video to Vimeo
    uploadVideo2(file: File): void {
        if (file) {
            this.vimeoService.createVimeoUpload(file).subscribe(
                (response) => {
                    const uploadUrl = response.upload.upload_link; // Vimeo returns a TUS upload URL
                    this.vimeoService.uploadVideoWithTus(file, uploadUrl)
                        .then((url) => {
                            console.log('Video uploaded successfully!', url);
                            // this.uploadProgress = 'Upload completed!';
                        })
                        .catch((error) => {
                            console.error('Video upload failed.', error);
                            // this.uploadProgress = 'Upload failed.';
                        });
                },
                (error) => {
                    console.error('Failed to create Vimeo upload.', error);
                    // this.uploadProgress = 'Failed to create upload.';
                }
            );
        }
    }
    async uploadVideoApiVideo(file: File, courseId: number, classType: number): Promise<string | null> {
  try {
    console.log('Starting video upload for file:', file.name);

    // --- 1. Get Upload Token (No changes here) ---
    const tokenResponse = await this.getApiVideoUploadToken<any>();
    console.log('Token response full object:', tokenResponse);
    if (!tokenResponse['success'] && !tokenResponse['status']) {
      console.error('Token response indicates failure:', tokenResponse);
      throw new Error(tokenResponse['message'] || 'Failed to get upload token');
    }

    const uploadUrl = tokenResponse['innerData']?.uploadUrl;
    if (!uploadUrl) {
      throw new Error('Upload URL is missing in token response');
    }
    console.log('Upload URL received:', uploadUrl);

    // --- 2. Upload file to the provided URL ---
    const uploadResponse = await this.uploadToApiVideo<any>(uploadUrl, file);
    console.log('Upload response:', uploadResponse);

    // [تعديل جوهري] علامة النجاح هنا هي وجود 'videoId'
    if (!uploadResponse || !uploadResponse['videoId']) {
      throw new Error('Upload response did not contain a videoId.');
    }

    // --- 3. Save Video Metadata ---
    const videoId = uploadResponse['videoId']; // Get the videoId
    console.log('Video ID after upload:', videoId);

    const meta = {
      videoId,
      title: file.name,
      courseId,
      classType,
    };

    const saveResponse = await this.saveApiVideoMetadata<any>(meta);
    console.log('Save metadata response:', saveResponse);

    // This check remains the same, assuming this API returns status/success
    if (!saveResponse['success'] && !saveResponse['status']) {
      throw new Error(saveResponse['message'] || 'Saving video metadata failed');
    }

    console.log('🚀 Video upload and metadata save completed successfully.');
    return videoId;

  } catch (err: any) {
    console.error('Video upload process failed:', err);
    const message = err?.message || 'An unknown error occurred during video upload.';
    this._toastrService.error(message);
    return null;
  }
}



}
