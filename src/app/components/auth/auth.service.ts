import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  // auth functions
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  geAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  autoAuthUser() {
    const autInformation = this.getAuthData();
    if (!autInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = autInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = autInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }

  }


  private saveAuthData(token: string, expirationDate: Date) {
    // localstorage api we can access
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthdata() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }


  private setAuthTimer(duration: number) {
    console.log('setting time: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000)
  }
  // user funcions

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post('http://localhost:8080/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password }
    this.http.post<{ token: string, expiresIn: number }>('http://localhost:8080/api/user/login', authData).subscribe(response => {
      const token = response.token;
      this.token = token;

      if (token) {
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date;
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expirationDate);
        this.router.navigate(["/teams"]);
      }

    });
  }

  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthdata();
    this.router.navigate(["/"]);
  }


}
