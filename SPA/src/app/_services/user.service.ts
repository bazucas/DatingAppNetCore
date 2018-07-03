import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { User } from '../_models/User';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get(this.baseUrl + 'users')
     .pipe(
      map(response => <User[]>response),
      catchError(this.handleError));
  }

  getUser(id): Observable<User> {
    return this.http
      .get(this.baseUrl + 'users/' + id)
      .pipe(
        map(response => <User>response),
        catchError(this.handleError));
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
