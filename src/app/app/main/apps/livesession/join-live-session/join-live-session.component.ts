import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { LivesessionService } from '../livesession.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-live-session',
  templateUrl: './join-live-session.component.html',
})
export class JoinLiveSessionComponent implements OnInit {
  sessions: any[] = [];
  selectedSession: any = null;
  successMessage = '';
  errorMessage = '';
  roomId: string = '';
  route = inject(Router);

  @ViewChild('videoContainer', { static: false }) videoContainer!: ElementRef<HTMLDivElement>;

  private langSub?: Subscription;

  constructor(
    private liveService: LivesessionService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadSessions();
    this.langSub = this.translate.onLangChange.subscribe((_e: LangChangeEvent) => {
      this.loadSessions();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  loadSessions() {
  this.liveService.getUpcomingSessions().subscribe((res: any) => {
    if (res.status) {
      const rawSessions = res.innerData || [];

      // نجمع الـ group sessions حسب roomId (أو id بتاع الـ time_slot لو unique)
      const grouped: any = {};

      rawSessions.forEach((s: any) => {
        if (s.time_slot.sessionType === 'group') {
          const key = s.time_slot.roomID || s.time_slot.id; // حسب المفتاح المتاح عندك
          if (!grouped[key]) {
            grouped[key] = { ...s, studentCount: 1 };
          } else {
            grouped[key].studentCount += 1; // نزود عدد الطلبة
          }
        } else {
          // الـ solo نسيبها زي ما هي
          grouped[`${s.id}_solo`] = { ...s, studentCount: 1 };
        }
      });

      // حول الـ object لمصفوفة
      this.sessions = Object.values(grouped);
    }
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
          // مجرد نعمل Navigate لصفحة الـ Room
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
      this.errorMessage = 'حصل خطأ أثناء الانضمام.';
    }
  });
}


  cancelSession(sessionId: number) {
    this.liveService.cancelSession(sessionId).subscribe({
      next: (res) => {
        console.log('Session canceled:', res);
        this.sessions = this.sessions.filter(s => s.id !== sessionId);
      },
      error: (err) => {
        console.error('Cancel failed:', err);
      }
    });
  }
}
