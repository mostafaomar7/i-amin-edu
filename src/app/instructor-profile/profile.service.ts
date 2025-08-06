import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = `${environment.apiUrl}/dashboard/view-profile`;

  constructor(private http: HttpClient) { }

  getInstructorProfile(): Observable<any> {
    const token = localStorage.getItem('authToken'); // أو من service حسب مكان حفظه
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(this.apiUrl, { headers });
  }
  updateInstructorProfile(payload: any): Observable<any> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  const url = `${environment.apiUrl}/dashboard/update-profile`;
  return this.http.patch(url, payload, { headers }); // ✅ بدل post بـ patch
}

resetPassword(oldPassword: string, newPassword: string): Observable<any> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const body = {
    oldPassword,
    newPassword
  };

  const url = `${environment.apiUrl}/dashboard/reset-password`;
  return this.http.patch(url, body, { headers });  
}

addBankAccount(payload: any): Observable<any> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const url = `${environment.apiUrl}/dashboard/bank-account`;
  return this.http.post(url, payload, { headers });
}
getBankAccounts(): Observable<any> {
  const token = localStorage.getItem('authToken'); // تأكد ان التوكن موجود
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<any>(`${environment.apiUrl}/dashboard/bank-account`, { headers });
}
deleteBankAccount(id: number): Observable<any> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  const url = `${environment.apiUrl}/dashboard/bank-account/${id}`;
  return this.http.delete(url, { headers });
}


}
