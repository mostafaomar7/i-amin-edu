import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class BrokerService {
  private api_url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDataTableRows() {
    const token = localStorage.getItem('authToken'); // أو حسب اسمك
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.api_url}/broker/all`, { headers }).toPromise();
  }

  deleteItem(id: number) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.api_url}/broker/${id}`, { headers }).toPromise();
  }
  createBroker(data: any) {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post<any>(`${this.api_url}/broker/create`, data, { headers }).toPromise();
}
updateBroker(data: any) {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.put<any>(`${this.api_url}/broker/update`, data, { headers }).toPromise();
}

getBrokerById(id: number) {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.api_url}/broker/${id}`, { headers }).toPromise();
}
uploadImage(file: File) {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  const formData = new FormData();
  formData.append('file', file, file.name);

  return this.http.post<any>(`${this.api_url}/upload-media`, formData, { headers }).toPromise();
}


}
