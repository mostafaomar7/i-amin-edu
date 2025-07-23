import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ApiService} from '@core/services/api.service';
import {ApiResult} from '@core/types/api-result';

export interface HomePageData {
    totalCourses: number;
    totalInstructors: number;
    totalLives: number;
    totalStudents: number;
}

@Injectable({providedIn: 'root'})
export class HomeService extends ApiService {
    constructor(
        private _httpClient: HttpClient,
        private _toastrService: ToastrService
    ) {
        super(_httpClient, _toastrService);
    }

    contactUs(request: any): Promise<ApiResult<any>> {
        return this.postResponse('mobile/submit-contact-us', request);
    }

    getHomePageData(): Promise<ApiResult<HomePageData>> {
        return this.getResponse('dashboard/home', false);
    }
}
