import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LivesessionService {

  private createSlotUrl = `${environment.apiUrl}/dashboard/create-slot`;
  private getSlotsUrl = `${environment.apiUrl}/dashboard/get-slots`;

  constructor(private http: HttpClient) { }

  createSlot(data: any) {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.createSlotUrl, data, { headers });
  }

  getSlots() {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(this.getSlotsUrl, { headers });
  }
  deleteSlot(id: number) {
  const token = localStorage.getItem('authToken');

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  return this.http.request('DELETE', `${environment.apiUrl}/dashboard/delete-slot`, {
    headers,
    body: { slotId: id } 
  });
}
getUpcomingSessions() {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get(`${environment.apiUrl}/dashboard/upcoming-sessions`, { headers });
}

joinSession(liveSessionId: number) {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  return this.http.post(`${environment.apiUrl}/dashboard/join-session`, { liveSessionId }, { headers });
}
cancelSession(sessionId: number) {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  return this.http.delete(`${environment.apiUrl}/dashboard/cancel-session/${sessionId}`, { headers });
}



}

