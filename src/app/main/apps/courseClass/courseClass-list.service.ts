import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/types/api-result';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { VimeoService } from '../../../../@core/services/vimeo.service';

@Injectable()
export class CourseClassListService extends ApiService {
    public routeEndPoint: string = 'course-class';

    private _uploadProgress = new BehaviorSubject<number>(0);
    public uploadProgress$ = this._uploadProgress.asObservable();

    constructor(
        private _httpClient: HttpClient,
        private _toastrService: ToastrService,
        private vimeoService: VimeoService
    ) {
        super(_httpClient, _toastrService);
    }

    // ... باقي الدوال لم تتغير ...
    getDataTableRows(id: string): Promise<ApiResult<any>> { return this.getResponse(`${this.routeEndPoint}/all/${id}`); }
    addItem(request: any): Promise<ApiResult<any>> { return this.postResponse(`${this.routeEndPoint}/create`, request); }
    updateItem(request: any): Promise<ApiResult<any>> { return this.putResponse(`${this.routeEndPoint}/update`, request); }
    updateVideo(id: string, request: any): Promise<ApiResult<any>> { return this.putResponse(`${this.routeEndPoint}/update-video/${id}`, request); }
    deleteItem(id: string): Promise<ApiResult<any>> { return this.deleteResponse(`${this.routeEndPoint}/delete-video/${id}`); }
    getItem(id: string): Promise<ApiResult<any>> { return this.getResponse(`${this.routeEndPoint}/${id}`); }


    async uploadVideoApiVideo(file: File, courseId: number, classType: number): Promise<string | null> {
        try {
            this._uploadProgress.next(0);
    
            const tokenResponse = await this.getApiVideoUploadToken<any>();
            if (!tokenResponse['success'] && !tokenResponse['status']) {
                throw new Error(tokenResponse['message'] || 'Failed to get upload token');
            }
            const uploadUrl = tokenResponse['innerData']?.uploadUrl;
            if (!uploadUrl) {
                throw new Error('Upload URL is missing in token response');
            }
    
            // --- بداية التعديل: إنشاء FormData ووضع الملف بداخلها ---
            const formData = new FormData();
            formData.append('file', file, file.name); // 'file' هو اسم الحقل الذي يتوقعه api.video

            // استخدم formData بدلاً من file مباشرةً في الطلب
            const req = new HttpRequest('POST', uploadUrl, formData, {
                reportProgress: true,
            });
            // --- نهاية التعديل ---

            const upload$ = this._httpClient.request(req).pipe(
                tap(event => {
                    if (event.type === HttpEventType.UploadProgress) {
                        const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
                        this._uploadProgress.next(percentDone);
                    }
                })
            );
    
            const lastEvent = await upload$.toPromise();
            const uploadResponse = (lastEvent as any).body;
    
            if (!uploadResponse || !uploadResponse['videoId']) {
                throw new Error('Upload response did not contain a videoId.');
            }
            const videoId = uploadResponse['videoId'];
            const meta = { videoId, title: file.name, courseId, classType };
            const saveResponse = await this.saveApiVideoMetadata<any>(meta);
            if (!saveResponse['success'] && !saveResponse['status']) {
                throw new Error(saveResponse['message'] || 'Saving video metadata failed');
            }
    
            this._uploadProgress.next(100);
            return videoId;
    
        } catch (err: any) {
            this._uploadProgress.next(0);
            console.error('Video upload process failed:', err);
            const message = err?.message || 'An unknown error occurred during video upload.';
            this._toastrService.error(message);
            return null;
        }
    }
    // In: src/app/main/apps/courseClass/courseClass-list.service.ts

// استبدل الدالة القديمة بهذه الدالة المصححة في ملف السيرفيس
async uploadVideoAndCreateClass(file: File, formData: any): Promise<ApiResult<any>> {
    try {
        // الخطوة 1: رفع الفيديو والحصول على videoId
        this._uploadProgress.next(0);
        const tokenResponse = await this.getApiVideoUploadToken<any>();
        const uploadUrl = tokenResponse['innerData']?.uploadUrl;
        const fileData = new FormData();
        fileData.append('file', file, file.name);
        const req = new HttpRequest('POST', uploadUrl, fileData, { reportProgress: true });
        const upload$ = this._httpClient.request(req).pipe(
            tap(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
                    this._uploadProgress.next(percentDone);
                }
            })
        );
        const lastEvent = await upload$.toPromise();
        const uploadResponse = (lastEvent as any).body;
        const videoId = uploadResponse['videoId'];

        if (!videoId) {
            throw new Error('Failed to get videoId after upload.');
        }

        // الخطوة 2: تحديث كائن الفورم بالـ videoId الجديد
        formData.mediaUrl = videoId;
        
        // الخطوة 3: استدعاء دالة الإنشاء في الخادم بكل البيانات
        return this.addItem(formData);

    } catch (err) {
        this._uploadProgress.next(0);
        console.error('Upload and create process failed:', err);
        this._toastrService.error('Upload and create process failed.');

        // --- بداية التعديل: إضافة الخصائص المفقودة ---
        return { 
            status: false, 
            message: 'Failed to upload and create class.', 
            innerData: null,
            success: false,
            code: 0,
            authToken: null
        };
        // --- نهاية التعديل ---
    }
}
// أضف هذه الدالة الجديدة في ملف السيرفيس

}