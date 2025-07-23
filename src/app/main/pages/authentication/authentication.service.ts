import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ApiService} from '@core/services/api.service';
import {ApiResult} from '@core/types/api-result';
import {BehaviorSubject} from 'rxjs';
import {UserLoginData} from './interfaces/user-login';

@Injectable({providedIn: 'root'})
export class AuthenticationService extends ApiService {
    userData$: BehaviorSubject<UserLoginData | null> = new BehaviorSubject(null);

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _toastrService: ToastrService,
    ) {
        super(_httpClient, _toastrService);
        this.getUserData();
    }

    requestLogin(request: any): Promise<ApiResult<any>> {
        return this.postResponse('admin/login', request);
    }

    requestRegisterInstructor(request: any): Promise<ApiResult<any>> {
        return this.postResponse('admin/register', request);
    }

    getUserData(): void {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            this.userData$.next(userData);
        } else {
            this.userData$.next(null);
        }
    }

    getToken(): string {
        const token = localStorage.getItem('authToken');
        return token && token !== 'undefined' ? token : '';
    }

    logout(): void {
        this.userData$.next(null);
        localStorage.clear();
    }


}
