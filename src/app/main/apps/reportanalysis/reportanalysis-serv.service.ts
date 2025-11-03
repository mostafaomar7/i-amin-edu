import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ApiPieChartData {
  totalRevenue: number;
  totalPayouts: number;
  revenuePercentage: number;
  payoutsPercentage: number;
}

export interface ApiBarChartData {
  students: number;
  instructors: number;
  organizations: number;
  brokers: number;
  courses: number;
  consultations: number;
}

export interface ApiResponse {
  status: boolean;
  innerData: {
    pieChart: ApiPieChartData;
    barChart: ApiBarChartData;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReportanalysisServService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getReportAnalysis(): Observable<ApiResponse> {
    const endpoint = `${this.apiUrl}/transaction-history/report-analysis`;

    // جلب التوكن من LocalStorage
    const token = localStorage.getItem('authToken');

    // إعداد الهيدرز
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // إرسال الطلب بالهيدر
    return this.http.get<ApiResponse>(endpoint, { headers });
  }
}
