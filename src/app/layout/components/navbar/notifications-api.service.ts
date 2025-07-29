import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllNotifications(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'accept-language': 'ar'
    });

    return this.http.get(`${this.baseUrl}/notification/all`, { headers });
  }
}
