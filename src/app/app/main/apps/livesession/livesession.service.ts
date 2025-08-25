import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class LivesessionService {
  private baseUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  private authHeaders(json = true) {
    const token = localStorage.getItem('authToken') || '';
    const base: any = { Authorization: `Bearer ${token}` };
    if (json) base['Content-Type'] = 'application/json';
    return new HttpHeaders(base);
  }

  createSlot(data: any) {
    return this.http.post(`${this.baseUrl}/create-slot`, data, { headers: this.authHeaders() });
  }

  getSlots() {
    return this.http.get(`${this.baseUrl}/get-slots`, { headers: this.authHeaders(false) });
  }

  deleteSlot(id: number) {
    return this.http.request('DELETE', `${this.baseUrl}/delete-slot`, {
      headers: this.authHeaders(),
      body: { slotId: id },
    });
  }

  getUpcomingSessions() {
    return this.http.get(`${this.baseUrl}/upcoming-sessions`, { headers: this.authHeaders(false) });
  }

  joinSession(liveSessionId: number) {
    // بيرجع kitToken + roomId من الباك إند
    return this.http.post(
      `${this.baseUrl}/join-session`,
      { liveSessionId },
      { headers: this.authHeaders() }
    );
  }

  cancelSession(sessionId: number) {
    return this.http.delete(`${this.baseUrl}/cancel-session/${sessionId}`, {
      headers: this.authHeaders(),
    });
  }
}
