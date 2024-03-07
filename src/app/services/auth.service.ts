import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiLoginUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private router: Router) {}

  isAuthenticated(): boolean {
    // console.log(localStorage.getItem('token'));
    return !!localStorage.getItem('token');
  }

  login(loginData: any) {
    this.http
      .post<{ token: string }>(`${this.apiLoginUrl}/login`, loginData)
      .subscribe((res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/home']);
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
    location.reload();
  }
}
