import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

    constructor(private router: Router, private as: AuthService) { }
    async canActivate(): Promise<boolean> {
        if (this.as.isAuthenticated()) {
            return await this.as.loginIsAdmin().then(res => {
                if (res) {
                    return res;
                } else {
                    this.router.navigate(['/home']);
                    return false;
                }
            });
        } else {
            return false;
        }
    }
}
