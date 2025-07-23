import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import * as tus from 'tus-js-client';

export type VimeoVideoUploadStatus = 'default' | 'preparing' | 'uploading' | 'paused' | 'complete' | 'error';

@Injectable({
    providedIn: 'root',
})
export class VimeoService {
    videoUploadStatus$: BehaviorSubject<{
        status: VimeoVideoUploadStatus,
        progress: number
    }> = new BehaviorSubject<any>({status: 'default', progress: 0});
    private vimeoUploadUrl = 'https://api.vimeo.com/me/videos';
    private accessToken = '9073ecbfd483d5fc1702563c94b7953f';  // Replace with your actual Vimeo access token

    constructor(private http: HttpClient) {
    }

    // Create a video upload in Vimeo using the TUS protocol
    createVimeoUpload(file: File): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
        });

        const body = {
            upload: {
                approach: 'tus',
                size: file.size,
            },
        };

        return this.http.post(this.vimeoUploadUrl, body, {headers});
    }

    // Use tus-js-client to upload the video
    uploadVideoWithTus(file: File, uploadUrl: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const upload = new tus.Upload(file, {
                endpoint: uploadUrl,
                uploadUrl: uploadUrl,
                retryDelays: [0, 1000, 3000, 5000],
                metadata: {
                    filename: file.name,
                    filetype: file.type,
                },
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
                onError: (error) => {
                    console.error('Failed because: ' + error);
                    this.videoUploadStatus$.next({status: 'error', progress: 0});
                    reject(error);
                },
                onProgress: (bytesUploaded, bytesTotal) => {
                    const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
                    console.log('-> percentage', percentage);
                    console.log('-> bytesTotal', bytesTotal);
                    console.log('-> bytesUploaded', bytesUploaded);
                    this.videoUploadStatus$.next({status: 'uploading', progress: parseFloat(percentage)});
                    console.log(bytesUploaded, bytesTotal, percentage + '%');
                },
                onSuccess: () => {
                    console.log('Upload finished:', upload.url);
                    this.videoUploadStatus$.next({status: 'complete', progress: 100});
                    resolve(upload.url);
                },
            });

            upload.start();
        });
    }
}
