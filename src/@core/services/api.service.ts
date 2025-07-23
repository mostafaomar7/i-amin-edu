import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Observable, of as observableOf} from 'rxjs';
import {catchError, map, take} from 'rxjs/operators';
import {ApiResult} from '@core/types/api-result';
import {ToastrService} from 'ngx-toastr';
import {environment} from 'environments/environment';



export abstract class ApiService {
    protected token: string;

    constructor(
        private http: HttpClient,
        private _snackBar: ToastrService,
    ) {
    }

    protected _errorMessage: string;

    public get errorMessage(): string {
        return this._errorMessage;
    }

    protected async getResponse<T>(route: string, requireAuth = true): Promise<ApiResult<T>> {
        const uri = `${environment.apiUrl}/${route}`;
        return this.parseResponse<T>(this.http.get<T>(uri, this.buildHeaders(requireAuth)));
    }

    protected async postResponse<T>(route: string, data?: unknown, requireAuth = true): Promise<ApiResult<T>> {
        const uri = `${environment.apiUrl}/${route}`;
        return this.parseResponse<T>(this.http.post<T>(uri, JSON.stringify(data), this.buildHeaders(requireAuth)));
    }

    protected async postMultiDataResponse<T>(route: string, data: any, requireAuth = true): Promise<ApiResult<T>> {
        const uri = `${environment.apiUrl}/${route}`;
        return this.parseResponse<T>(this.http.post<T>(uri, data, this.buildHeaders(requireAuth, true)));
    }

    protected async putResponse<T>(route: string, data?: unknown, requireAuth = true): Promise<ApiResult<T>> {
        const uri = `${environment.apiUrl}/${route}`;
        return this.parseResponse<T>(this.http.put<T>(uri, JSON.stringify(data), this.buildHeaders(requireAuth)));
    }

    protected async deleteResponse<T>(route: string, requireAuth = true): Promise<ApiResult<T>> {
        const uri = `${environment.apiUrl}/${route}`;
        return this.parseResponse<T>(this.http.delete<T>(uri, this.buildHeaders(requireAuth)));
    }

    protected async postVimeoDataResponse<T>(file: any): Promise<ApiResult<T>> {
        const uri = 'https://api.vimeo.com/me/videos';
        let headers = new HttpHeaders({
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Authorization': 'Bearer 9073ecbfd483d5fc1702563c94b7953f',
            'Accept': 'application/vnd.vimeo.*+json;version=3.4',
            'Access-Control-Allow-Origin': '*',
        });
        return this.parseResponse<T>(this.http.post<T>(uri, file, {headers, observe: 'response'}));
    }

    protected async postVimeoDataResponseNew<T>(file: any): Promise<ApiResult<T>> {
        const uri = 'https://api.vimeo.com/me/videos';
        // const uri = '/api';
        let headers = new HttpHeaders({
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Authorization': 'Bearer 9073ecbfd483d5fc1702563c94b7953f',
            'Accept': 'application/vnd.vimeo.*+json;version=3.4',
            'Access-Control-Allow-Origin': '*',
        });
        // 'Authorization': 'Bearer ab6b1ba3822dd1f716d715f1da79f5e4',

        return this.parseResponse<T>(this.http.post<T>(uri, {
            upload: {
                approach: 'tus',
                size: file.size,
            }
        }, {headers, observe: 'response'}));
    }
    protected async postApiVideoDataResponse<T>(file: File): Promise<ApiResult<T>> {
    const uri = 'https://ws.api.video/upload';
    const headers = new HttpHeaders({
        'Authorization': 'Bearer YOUR_API_VIDEO_TOKEN_HERE'
    });

    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.parseResponse<T>(this.http.post<T>(uri, formData, { headers, observe: 'response' }));
}

    protected async getApiVideoUploadToken<T>(): Promise<ApiResult<T>> {
    const uri = `${environment.apiUrl}/course-class/upload-token`;
    return this.parseResponse<T>(this.http.get<T>(uri, this.buildHeaders(true)));
    }

    protected async uploadToApiVideo<T>(uploadUrl: string, file: File): Promise<ApiResult<T>> {
    const formData = new FormData();
    formData.append('video', file);

    try {
        return await this.parseResponse<T>(this.http.post<T>(uploadUrl, formData, {
            reportProgress: true,
            observe: 'response'
        }));
    } catch (error) {
        console.error('Error during uploadToApiVideo:', error);
        throw error;  // أرسل الخطأ لفوق عشان يعالجه catch في uploadVideoApiVideo
    }
}

    protected async saveApiVideoMetadata<T>(data: any): Promise<ApiResult<T>> {
    const uri = `${environment.apiUrl}/course-class/save-metadata`;
    return this.parseResponse<T>(this.http.post<T>(uri, JSON.stringify(data), this.buildHeaders(true)));
    }


    private buildResponse<T>(res: any): ApiResult<T> {
        const output = res.body as unknown as ApiResult<T>;
        const resToken = res.headers.get('X-Auth-Token');
        if (resToken && output.authToken !== resToken) {
            output.authToken = resToken;
        }
        return output;
    }

    private buildHeaders(requireAuth = true, isMultiPart = false): any {
        this._errorMessage = '';
        let headers = new HttpHeaders({
            'Referrer-Policy': 'strict-origin-when-cross-origin'
            // Other headers...
        });

        if (requireAuth) {
            headers = headers.append('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
        }

        if (!isMultiPart) {
            headers = headers.append('Content-Type', 'application/json');

        }
        headers = headers.append('accept-language', 'ar');


        return {headers, observe: 'response'};
    }

    private errorResponse<T>(err): ApiResult<T> {
        return {
            code: err.status,
            message: err.message,
            data: err
        } as unknown as ApiResult<T>;
    }

    private async parseResponse<T>(res: Observable<HttpEvent<T>>): Promise<ApiResult<T>> { 
  try {
    const data = await res.pipe(
      map((r) => this.buildResponse<T>(r))
    ).toPromise();
    if (data.authToken) {
      localStorage.setItem('authToken', data.authToken);
    }
    if (!data.status) {
      this._errorMessage = data.message;
      this._snackBar.error(data.message + ' ❌');
    }
    return data;
  } catch (err) {
    console.error('Error in parseResponse:', err);
    throw err;  // ترمي الخطأ للأعلى لتلتقطه الدالة اللي نادت parseResponse
  }
}
}