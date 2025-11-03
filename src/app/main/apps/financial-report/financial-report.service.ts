// financial-report.service.ts
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialReportService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFinancialSummary(currency: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/transaction-history/financial-summary?currency=${currency}`, { headers });
  }

  getAllTransactions(page: number = 1, limit: number = 50): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/transaction-history/all-transactions?page=${page}&limit=${limit}`, { headers });
  }
}
