import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private api_url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  postRate(rate: number): Observable<any> {
    // هنا بتحط التوكن
    const token = localStorage.getItem('authToken'); // أو لو عندك سيرفس auth بيجيب التوكن

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put(`${this.api_url}/exchange-rate`, { rate }, { headers });
  }
}
