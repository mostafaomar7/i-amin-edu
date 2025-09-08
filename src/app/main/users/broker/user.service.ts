import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api_url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  listUsers(): Observable<any> {
    const token = localStorage.getItem('authToken'); // أو أي مكان مخزن فيه التوكن
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // معظم الـ APIs يستخدم Bearer token
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.api_url}/broker/user-management/list-users`, { headers });
  }

  addUser(userData: any): Observable<any> {
  const token = localStorage.getItem('authToken');
  const headers = { 'Authorization': `Bearer ${token}` }; // لا تحدد Content-Type، Angular هيتعامل مع FormData
  return this.http.post(`${this.api_url}/broker/user-management/add-user`, userData, { headers });
}

}
