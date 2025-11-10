import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LivesessionService } from './livesession.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { en } from './en';
import { ar } from './ar';
import { InstructorsListService } from 'app/main/users/instructors/instructors-list.service';
import { PermissionListService } from 'app/main/users/permissions/permission-list.service';
import { Role } from 'app/auth/models';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-livesession',
  templateUrl: './livesession.component.html',
  styleUrls: ['./livesession.component.scss']
})
export class LivesessionComponent implements OnInit {
  sessionForm!: FormGroup;
  sessions: any[] = [];
  selectedType: 'group' | 'solo' = 'group';
  filteredSessions: any[] = [];
  statusMessage: string = '';
  statusType: 'success' | 'error' | '' = '';
  
  teachers: any[] = [];   
     
  availableTimes: string[] = [
    '08:00','09:00','10:00','11:00',
    '12:00','13:00','14:00','15:00',
    '16:00','17:00','18:00','19:00',
    '20:00','21:00','22:00','23:00','00:00'
  ];

  visibleDates: Date[] = [];
  currentStartDate: Date = new Date();
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  selectedDay: string | null = null;

  public userType: any;

  constructor(
  private fb: FormBuilder,
  private sessionService: LivesessionService,
  private translate: TranslateService,
  private _instructorsListService: InstructorsListService,
  private _permissionListService: PermissionListService,
) {
  this.translate.setTranslation('en', en, true);
  this.translate.setTranslation('ar', ar, true);

  // شوف اللغة المخزنة في localStorage أو خذ اللغة الحالية من translate
  const currentLang = localStorage.getItem('language') || this.translate.currentLang || 'en';

  this.translate.setDefaultLang(currentLang);
  this.translate.use(currentLang);

  this.translate.onLangChange.subscribe((event: LangChangeEvent) => {});
}


  ngOnInit(): void {
    this.userType = Number(localStorage.getItem('userType'));

    this.sessionForm = this.fb.group({
      sessionTitle: [''],
      sessionDescription: [''],
      numberOfSeats: [1],
      sessionPrice: [10],
      sessionType: [this.selectedType],
      slotDateAndTime: [''],
      sessionInstructor: ['']  // teacherId
    });

    // لو user هو teacher، نعبي الـ teacherId تلقائي
    if (this.userType === 3) { // Teacher
      const userId = JSON.parse(localStorage.getItem('userData')).id;
      this.sessionForm.patchValue({ sessionInstructor: userId });
    }

    this.generateVisibleDates();
    this.loadSessions();
    this.getTeachers();
  }

  showMessage(message: string, type: 'success' | 'error') {
    this.statusMessage = message;
    this.statusType = type;
    setTimeout(() => {
      this.statusMessage = '';
      this.statusType = '';
    }, 10000);
  }

  async getTeachers() {
    let centerId = 0;
    switch (this._permissionListService.getRoleType()) {
      case Role.Admin:
        break;
      default:
        centerId = JSON.parse(localStorage.getItem('userData')).id;
        break;
    }
    await this._instructorsListService.getDataTableRows(centerId).then((response: any) => {
      if (response.status) {
        this.teachers = response.innerData;
      }
    });
  }

  switchType(type: 'group' | 'solo') {
    this.selectedType = type;
    this.sessionForm.patchValue({ sessionType: type });

    if (type === 'solo') {
      this.sessionForm.patchValue({ numberOfSeats: 1, slotDateAndTime: '' });
      this.selectedDate = null;
      this.selectedTime = null;
      this.selectedDay = null;
      this.currentStartDate = new Date();
      this.generateVisibleDates();
    }
    this.filterSessions();
  }

  formatTime12(time24: string): string {
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${m.toString().padStart(2,'0')} ${ampm}`;
  }

 loadSessions() {
  this.sessionService.getSlots().subscribe({
    next: (res: any) => {
      if (res?.status && res?.innerData) {
        const now = new Date().getTime();

        // 🔹 نحذف فعليًا من السيرفر الجلسات المنتهية
        res.innerData.forEach((s: any) => {
          const sessionTime = new Date(s.slotDateAndTime).getTime();
          if (sessionTime < now) {
            this.sessionService.deleteSlot(s.id).subscribe({
              next: () => console.log(`⏰ Deleted expired session ID: ${s.id}`),
              error: (err) => console.warn(`⚠️ Failed to delete expired session ID: ${s.id}`, err)
            });
          }
        });

        // 🔹 نفلتر ونحتفظ فقط بالجلسات الفعالة وغير المحجوزة
        this.sessions = res.innerData.filter((s: any) => {
          const sessionTime = new Date(s.slotDateAndTime).getTime();

          // 1️⃣ نحذف الجلسات القديمة
          if (sessionTime < now) return false;

          // 2️⃣ نحذف جلسات الـ Solo المحجوزة
          if (s.sessionType === 'solo' && s.numberOfSeats === 0) return false;

          return true;
        });

        this.filterSessions();
      }
    },
    error: () => {
      this.showMessage('❌ Error fetching sessions', 'error');
    }
  });
}

  filterSessions() {
    this.filteredSessions = this.sessions.filter(s => s.sessionType === this.selectedType);
  }

  selectDay(date: string) {
    this.selectedDay = date;
    this.selectedDate = null;
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }

  generateVisibleDates() {
    this.visibleDates = [];
    const start = new Date(this.currentStartDate);
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < 4; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      this.visibleDates.push(d);
    }

    if (this.selectedDate) {
      const inRange = this.visibleDates.some(d => this.sameYMD(d, this.selectedDate!));
      if (!inRange) this.selectedDate = null;
    }
  }

  prevDates() {
    const d = new Date(this.currentStartDate);
    d.setDate(d.getDate() - 5);
    this.currentStartDate = d;
    this.generateVisibleDates();
  }

  nextDates() {
    const d = new Date(this.currentStartDate);
    d.setDate(d.getDate() + 5);
    this.currentStartDate = d;
    this.generateVisibleDates();
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.selectedDay = null;
  }

  formatDate(date: Date): string {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  private sameYMD(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  createSession() {
  let slotDateAndTime: string;

if (this.selectedDate && this.selectedTime) {
  const [h, m] = this.selectedTime.split(':').map(Number);
  const d = new Date(this.selectedDate);
  d.setHours(h, m ?? 0, 0, 0);
  slotDateAndTime = d.toISOString();
} else {
  this.showMessage('Please select a date and time.', 'error');
  return;
}


  if (this.userType === 2 && !this.sessionForm.value.sessionInstructor) {
    this.showMessage('Please select a teacher', 'error');
    return;
  }

  const { sessionInstructor, ...rest } = this.sessionForm.value;

  const data = {
    ...rest,
    slotDateAndTime,
    teacherId: Number(sessionInstructor) // فقط teacherId
  };


  console.log("Data to send:", data); // للتأكد قبل الإرسال

  this.sessionService.createSlot(data).subscribe({
    next: (res: any) => {
      if (res?.status) {
        this.showMessage('✅ Session created successfully', 'success');
        this.loadSessions();
        if (this.selectedType === 'solo') {
          this.selectedDate = null;
          this.selectedTime = null;
          this.selectedDay = null;
        }
      } else {
        this.showMessage(res.message || '❌ Failed to create session', 'error');
      }
    },
    error: (err) => {
      this.showMessage(err.error?.message || '❌ Something went wrong', 'error');
    }
  });
}



  deleteSession(id: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this session?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'No, keep it',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this.sessionService.deleteSlot(id).subscribe({
        next: () => {
          this.showMessage('🗑️ Session deleted successfully', 'success');
          this.loadSessions();
          Swal.fire('Deleted!', 'The session has been deleted.', 'success');
        },
        error: (err) => {
          this.showMessage(err.error?.message || '❌ Failed to delete session', 'error');
        }
      });
    }
  });
}
}
