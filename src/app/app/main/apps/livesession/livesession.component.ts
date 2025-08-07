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

  constructor(
    private fb: FormBuilder,
    private sessionService: LivesessionService
  ) {}

  ngOnInit(): void {
    this.sessionForm = this.fb.group({
      sessionTitle: [''],           // ← تمت إضافته
      sessionDescription: [''],     // ← تمت إضافته
      slotDateAndTime: [''],
      numberOfSeats: [1],
      sessionPrice: [10],
      sessionType: ['group']
    });
  }

  submitForm() {
    const data = {
      ...this.sessionForm.value,
      slotDateAndTime: new Date(this.sessionForm.value.slotDateAndTime).toISOString()
    };

    this.sessionService.createSlot(data).subscribe({
      next: (res) => {
        console.log('✅ تم الحجز بنجاح', res);
      },
      error: (err) => {
        console.error('❌ فشل الإرسال', err);
      }
    });
  }
}
