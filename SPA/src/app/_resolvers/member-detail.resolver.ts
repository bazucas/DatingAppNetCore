import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UserService } from './../_services/user.service';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {

    constructor(private userService: UserService,
        private router: Router,
        private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(route.params['id']).pipe(
            catchError(this.handleError));
    }

    private handleError() {
        this.alertify.error('Problem retrieving data');
        this.router.navigate(['/members']);
        return of(null);
        }
}
