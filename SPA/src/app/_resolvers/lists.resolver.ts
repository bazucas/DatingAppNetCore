import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UserService } from './../_services/user.service';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';

@Injectable()
export class ListsResolver implements Resolve<User[]> {
    pageSize = 5;
    pageNumber = 1;
    LikesParam = 'Likers';

    constructor(private userService: UserService,
        private router: Router,
        private alertify: AlertifyService) {}

    resolve(): Observable<User[]> {

        const call = this.userService.getUsers(this.pageNumber, this.pageSize, null, this.LikesParam);
        return call
            .pipe(
                catchError(err => {
                    this.alertify.error('Problem retrieving data');
                    this.router.navigate(['/home']);
                    return of(null);
                }));
    }
}
