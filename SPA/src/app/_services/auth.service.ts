import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './../_models/User';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthUser } from '../_models/authUser';

@Injectable()
export class AuthService {
  baseUrl = environment.apiUrl;
  userToken: any;
  decodedToken: any;
  currentUser: User;
  jwtHelper = new JwtHelperService();
  private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient,
      private jwtHelperService: JwtHelperService) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http.post<AuthUser>(this.baseUrl + 'auth/login', model, {headers: new HttpHeaders()
      .set('Content-Type', 'application/json')})
      .pipe(
        map(user => {
          if (user) {
            localStorage.setItem('token', user.tokenString);
            localStorage.setItem('user', JSON.stringify(user.user));
            this.currentUser = user.user;
            this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
            this.userToken = user.tokenString;
            if (this.currentUser.photoUrl !== null) {
              this.changeMemberPhoto(this.currentUser.photoUrl);
            } else {
              this.changeMemberPhoto('../../assets/user.png');
            }
          }
        }));
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'auth/register', user, {headers: new HttpHeaders()
      .set('Content-Type', 'application/json')});
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    if (token) {
      const isExpired = this.jwtHelper.isTokenExpired(token);
      return !isExpired;
    }
    return false;
  }
}
