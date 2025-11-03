import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service'; // عدل المسار حسب مكان الملف
import { ApiResult } from '@core/types/api-result';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class WalletService extends ApiService {

  private baseRoute = 'transaction-history';

  constructor(http: HttpClient, toast: ToastrService) {
    super(http, toast);  // مهم تمرير المتطلبات لـ ApiService
  }

  async getWalletStats(): Promise<ApiResult<any>> {
    return this.getResponse(`${this.baseRoute}/stats`);
  }

  async getCoursePurchases(
  page: number = 1,
  limit: number = 10,
  studentFName: string = '',
  studentLName: string = '',
  order: string = ''
): Promise<ApiResult<any>> {
  let route = `${this.baseRoute}/course-purchases?page=${page}&limit=${limit}`;

  if (studentFName) route += `&studentFName=${encodeURIComponent(studentFName)}`;
  if (studentLName) route += `&studentLName=${encodeURIComponent(studentLName)}`;
  if (order) route += `&order=${encodeURIComponent(order)}`;

  return this.getResponse(route);
}

async getBrokerWallet(): Promise<ApiResult<any>> {
  // 🔴 الكود القديم (مش هيتحذف، بس هيتعلق):
  return this.getResponse(`broker/transactions/wallet/statistics`);

  // ✅ الكود الجديد:
  // return this.getResponse(`${this.baseRoute}/stats`);
}

  async getSessionBookings(
  page: number = 1,
  limit: number = 10,
  studentFName: string = '',
  studentLName: string = '',
  order: string = ''
): Promise<ApiResult<any>> {
  let route = `${this.baseRoute}/session-bookings?page=${page}&limit=${limit}`;

  if (studentFName) route += `&studentFName=${encodeURIComponent(studentFName)}`;
  if (studentLName) route += `&studentLName=${encodeURIComponent(studentLName)}`;
  if (order) route += `&order=${encodeURIComponent(order)}`;

  return this.getResponse(route);
}

}
export type Locale = 'en' | 'ar';
