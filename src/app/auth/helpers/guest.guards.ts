import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {AuthenticationService} from 'app/auth/service';

@Injectable({providedIn: 'root'})
export class GuestGuards implements CanActivate {
    /**
     *
     * @param {Router} _router
     * @param {AuthenticationService} _authenticationService
     */
    constructor(private _router: Router, private _authenticationService: AuthenticationService) {
    }

    // canActivate
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (!this._authenticationService.getToken()) {
            return true;
        }

        // not logged in so redirect to login page with the return url
        this._router.navigate(['/dashboard'], {queryParams: {returnUrl: state.url}});
        return false;
    }
}
