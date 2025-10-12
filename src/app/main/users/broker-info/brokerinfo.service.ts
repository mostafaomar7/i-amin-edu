import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

// ✅ إحصائيات
export interface BrokerStatisticsResponse {
  status: boolean;
  innerData: {
    organizationCount: number;
    instructorCount: number;
    walletBalance: number;
  };
}

// ✅ المدرسين
export interface BrokerTeachersResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    titleEn: string;
    titleAr: string;
    experienceEn: string;
    experienceAr: string;
    hourRate: number;
    rateValue: number;
    rateCount: number;
    isFeatured: boolean;
    commission: number;            // ✅ أضفناها
    documentsCompleted: boolean;   // ✅ أضفناها
    canGoLive: boolean;            // ✅ أضفناها
    type: number;
    userId: number;
    brokerId: number;
    createdAt: string;             // ✅ أضفناها
    updatedAt: string;
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      image: string;
    };
  }[];
}


// ✅ المراكز
export interface BrokerCentersResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    info: string;
    commission: number;
    isActive: boolean;
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      image: string;
    };
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class BrokerinfoService {
  private api_url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // 📊 إحصائيات الوسيط
  getBrokerStatistics(brokerId: string | number): Observable<BrokerStatisticsResponse> {
    return this.http.get<BrokerStatisticsResponse>(
      `${this.api_url}/dashboard/statistics/broker/${brokerId}`,
      { headers: this.getHeaders() }
    );
  }

  // 👨‍🏫 المدرسين
  getBrokerTeachers(brokerId: string | number): Observable<BrokerTeachersResponse> {
    return this.http.get<BrokerTeachersResponse>(
      `${this.api_url}/broker/${brokerId}/teachers`,
      { headers: this.getHeaders() }
    );
  }

  // 🏫 المراكز
  getBrokerCenters(brokerId: string | number): Observable<BrokerCentersResponse> {
    return this.http.get<BrokerCentersResponse>(
      `${this.api_url}/broker/${brokerId}/centers`,
      { headers: this.getHeaders() }
    );
  }
}
