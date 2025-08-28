import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { ApiResult } from '@core/types/api-result';

import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../pages/authentication/authentication.service';
import { Role } from 'app/auth/models';

@Injectable({
  providedIn: 'root'
})
export class PermissionListService extends ApiService {

    public routeEndPoint: string = 'roles';

    public permissionList;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient

     */
    constructor(
        private _httpClient: HttpClient,
        private _toastrService: ToastrService,
        private _authenticationService: AuthenticationService
    ) {
        super(_httpClient, _toastrService);
    }

    /**
     * Get List
     */
    getDataTableRows(): Promise<ApiResult<any>> {
        return this.getResponse(`${this.routeEndPoint}/all`);
    }

    getAllPermissions(): Promise<ApiResult<any>> {
        return this.getResponse(`permissions/all`);
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
        return this.getResponse(`${this.routeEndPoint}/permissions/${id}`);
    }

    getMyPermissions() {
        const userData = this._authenticationService.userData$.value;
        if (userData && userData?.role && userData?.role?.id) {
            this.getResponse(`${this.routeEndPoint}/permissions/${userData?.role?.id}`).then((response: any) => {
                this.permissionList = response.innerData.permissions;
            });
        } else {
            this.permissionList = {};
        }
    }

    hasPermission(group: string, permission: string): boolean {
        const isFullPermission = this._authenticationService.userData$.value?.userType === 2 || this._authenticationService.userData$.value?.userType === 3;
        return isFullPermission ? true : this.permissionList[group]?.some((perm: any) => perm.name === permission);
    }

    getRoleType(): Role {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const userType = JSON.parse(userData).userType;
            switch (userType) {
                case Role.Admin:
                    return Role.Admin;
                case Role.Center:
                    return Role.Center;
                case Role.Teacher:
                    return Role.Teacher;
                case Role.Student:
                    return Role.Student;
                default:
                    return Role.Admin;
            }
        }
        return Role.Admin;
    }

}

