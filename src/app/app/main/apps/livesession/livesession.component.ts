import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LivesessionService } from './livesession.service';

@Component({
  selector: 'app-livesession',
  templateUrl: './livesession.component.html',
  styleUrls: ['./livesession.component.scss']
})
export class LivesessionComponent implements OnInit {

  sessionForm!: FormGroup;
  sessions: any[] = [];

  // أيام متاحة
  availableDays = [
    { date: '2025-08-15', label: 'Fri, 15 Aug' },
    { date: '2025-08-16', label: 'Sat, 16 Aug' },
    { date: '2025-08-17', label: 'Sun, 17 Aug' }
  ];

  // أوقات متاحة
  availableTimes = [
    '10:00',
    '14:00',
    '18:00'
  ];

  selectedDay: string | null = null;
  selectedTime: string | null = null;

  constructor(
    private fb: FormBuilder,
    private sessionService: LivesessionService
  ) {}

  ngOnInit(): void {
    this.sessionForm = this.fb.group({
      sessionTitle: [''],
      sessionDescription: [''],
      numberOfSeats: [1],
      sessionPrice: [10],
      sessionType: ['group']
    });

    this.loadSessions();
  }

  loadSessions() {
    this.sessionService.getSlots().subscribe({
      next: (res: any) => {
        if (res.status && res.innerData) {
          this.sessions = res.innerData;
        }
      },
      error: (err) => {
        console.error('❌ Error fetching sessions', err);
      }
    });
  }

  selectDay(date: string) {
    this.selectedDay = date;
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }

  createSession() {
    if (!this.selectedDay || !this.selectedTime) {
      alert('Please select a day and time');
      return;
    }

    const slotDateAndTime = new Date(`${this.selectedDay}T${this.selectedTime}:00`).toISOString();

    const data = {
      ...this.sessionForm.value,
      slotDateAndTime
    };

    this.sessionService.createSlot(data).subscribe({
      next: (res) => {
        console.log('✅ Session created successfully', res);
        this.loadSessions();
      },
      error: (err) => {
        console.error('❌ Failed to create session', err);
      }
    });
  }

  deleteSession(id: number) {
    if (confirm('Are you sure you want to delete this session?')) {
      this.sessionService.deleteSlot(id).subscribe({
        next: () => {
          console.log('🗑️ Session deleted successfully');
          this.loadSessions();
        },
        error: (err) => {
          console.error('❌ Failed to delete session', err);
        }
      });
    }
  }
}
