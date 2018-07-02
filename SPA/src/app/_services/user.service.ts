import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { User } from '../_models/User';

@Injectable()
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: Http) { }

  getUsers(): Observable<User[]> {
    return this.http.get(this.baseUrl + 'users', this.jwt())
    .pipe(
      tap(console.log),
      map(response => <User[]>response.json()),
      catchError(this.handleError));
  }

  private jwt() {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new Headers({'Authorization': 'Bearer ' + token});
      headers.append('Content-type', 'application/json');
      return new RequestOptions({headers: headers});
    }
  }

  private handleError(error: any) {
    const applicationError = error.headers.get('Application-Error');
    if (applicationError) {
      return Observable.throw(applicationError);
    }
    const serverError = error.json();
    let modelStateErrors = '';
    if (serverError) {
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }
    return throwError(modelStateErrors || 'Server error');
  }
}
