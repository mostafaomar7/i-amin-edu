import { Component, ElementRef, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { LivesessionService } from '../livesession.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-join-live-session',
  templateUrl: './join-live-session.component.html',
})
export class JoinLiveSessionComponent implements OnInit, OnDestroy {
  sessions: any[] = [];
  selectedSession: any = null;
  successMessage = '';
  errorMessage = '';
  roomId: string = '';
  route = inject(Router);

  @ViewChild('videoContainer', { static: false }) videoContainer!: ElementRef<HTMLDivElement>;

  private langSub?: Subscription;
  private autoRemoveSub?: any; // اشتراك التايمر

  constructor(
    private liveService: LivesessionService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadSessions();

    // نعيد تحميل الجلسات عند تغيير اللغة
    this.langSub = this.translate.onLangChange.subscribe((_e: LangChangeEvent) => {
      this.loadSessions();
    });

    // نشغل مؤقت كل دقيقة علشان نشيل الجلسات المنتهية
    this.autoRemoveSub = interval(60 * 1000).subscribe(() => {
      this.removeExpiredSessions();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.autoRemoveSub?.unsubscribe();
  }

  loadSessions() {
    this.liveService.getUpcomingSessions().subscribe((res: any) => {
      if (res.status) {
        const rawSessions = res.innerData || [];
        const grouped: any = {};

        rawSessions.forEach((s: any) => {
          if (s.time_slot.sessionType === 'group') {
            const key = s.time_slot.roomID || s.time_slot.id;
            if (!grouped[key]) {
              grouped[key] = { ...s, studentCount: 1 };
            } else {
              grouped[key].studentCount += 1;
            }
          } else {
            grouped[`${s.id}_solo`] = { ...s, studentCount: 1 };
          }
        });

        this.sessions = Object.values(grouped);
        this.removeExpiredSessions(); // نحذف الجلسات المنتهية فورًا بعد التحميل
      }
    });
  }

  /** 🔹 دالة تشيل أي جلسة انتهى ميعادها */
  removeExpiredSessions() {
    const now = new Date().getTime();

    this.sessions = this.sessions.filter((s) => {
      const sessionTime = new Date(s.time_slot.slotDateAndTime).getTime();

      // نضيف مثلاً 60 دقيقة كمدة الجلسة الافتراضية (ممكن تخليها dynamic من الـ backend)
      const sessionEnd = sessionTime + 60 * 60 * 1000;

      return sessionEnd > now; // نخلي فقط اللي لسه ما خلصتش
    });
  }

  enterRoom() {
    this.route.navigateByUrl(`/room/${this.roomId}`);
  }

  joinSession(sessionId: number) {
    this.errorMessage = '';
    this.successMessage = '';

    this.liveService.joinSession(sessionId).subscribe({
      next: (res: any) => {
        console.log('Full API Response:', res);
        const kitTokenObj = res?.innerData?.kitToken;

        if (kitTokenObj) {
          try {
            this.route.navigateByUrl(`/room/${kitTokenObj.roomID}`);
          } catch (e) {
            console.error(e);
            this.errorMessage = 'فشل فتح صفحة الجلسة.';
          }
        } else {
          this.errorMessage = 'الـ Backend لم يرجع kitToken/roomId.';
        }
      },
      error: (err) => {
        console.error(err);
        if (err?.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err?.message) {
          this.errorMessage = err.message;
        } else {
          this.errorMessage = 'حصل خطأ أثناء الانضمام.';
        }
      },
    });
  }

  cancelSession(sessionId: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to cancel this session?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, cancel it',
    cancelButtonText: 'No, keep it',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this.liveService.cancelSession(sessionId).subscribe({
        next: (res) => {
          console.log('Session canceled:', res);

          // ✅ الحل: إعادة تحميل الجلسات من السيرفر
          this.loadSessions();

          Swal.fire(
            'Cancelled!',
            'The session has been successfully cancelled.',
            'success'
          );
        },
        error: (err) => {
          console.error('Cancel failed:', err);
          Swal.fire(
            'Error!',
            'Something went wrong while cancelling the session.',
            'error'
          );
        },
      });
    }
  });
}

}
