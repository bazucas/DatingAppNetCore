import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(public authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() { }

  login() {
    this.authService.login(this.model).subscribe(data => {
      this.alertify.success('Logged in successfully');
    }, error => {
      this.alertify.error('Loggin error');
    });
  }

  logout() {
    this.authService.userToken = null;
    localStorage.removeItem('token');
    this.alertify.message('logged out');
  }

  loggedIn() {
    return this.authService.loggedIn();
  }
}
