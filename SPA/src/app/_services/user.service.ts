import { Headers } from '@angular/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { User } from '../_models/User';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';

@Injectable()
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(page?: number, itemsPerPage?: number, userParams?: any, likesParam?: string) {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let queryString = '?';

    if (page != null && itemsPerPage != null) {
      queryString += 'pageNumber=' + page + '&pageSize=' + itemsPerPage + '&';
    }

    if (likesParam === 'Likers') {
      queryString += 'Likers=true&';
    }

    if (likesParam === 'Likees') {
      queryString += 'Likees=true&';
    }

    if (userParams != null) {
      queryString += 'minAge=' + userParams.minAge + '&maxAge=' + userParams.maxAge + '&gender=' + userParams.gender +
        '&orderBy=' + userParams.orderBy;
    }

    return this.http
      .get(this.baseUrl + 'users' + queryString, {observe: 'response'})
      .pipe(
        map((response: any) => {
          paginatedResult.result = response;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }),
        catchError(this.handleError)
      );
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUser(id): Observable<User> {
    return this.http
      .get(this.baseUrl + 'users/' + id)
      .pipe(
        map(response => <User>response),
        catchError(this.handleError));
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {})
      .pipe(
        catchError(this.handleError)
      );
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  getMessages(id: number, page?: number, itemsPerPage?: number, messageContainer?: string) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
    let queryString = '?MessageContainer=' + messageContainer;
    if (page != null && itemsPerPage != null) {
      queryString += '&pageNumber=' + page + '&pageSize=' + itemsPerPage;
    }

    return this.http.get(this.baseUrl + 'users/' + id + '/messages' + queryString, {observe: 'response'})
      .pipe(
        map((response: any ) => {
          paginatedResult.result = response;

          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }

          return paginatedResult;
        }),
        catchError(this.handleError));
  }

  getMessageThread(id: number, recipientId: number) {
    return this.http.get(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError(this.handleError));
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + 'users/' + id + '/messages', message)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  deleteMessage(id: number, userId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  markAsRead(userId: number, messageId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {}).subscribe();
  }

  private handleError(error: any) {
    if (error.error === typeof('undefined') && error.status === 400) {
      return Observable.throw(error._body);
    }
    const applicationError = error.headers.get('Application-Error');
    if (applicationError) {
      return Observable.throw(applicationError);
    }
    return throwError(error.error || 'Server error');
  }
}
