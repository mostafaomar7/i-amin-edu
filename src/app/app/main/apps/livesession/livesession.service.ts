import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LivesessionService {

  private apiUrl = 'https://test.iamin-edu.com/api/v1/dashboard/create-slot';

  constructor(private http: HttpClient) { }

  createSlot(data: any) {
    const token = localStorage.getItem('authToken'); // ← تأكد الاسم صحيح

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, data, { headers });
  }
}
