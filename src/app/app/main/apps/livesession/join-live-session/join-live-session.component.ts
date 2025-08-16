import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LivesessionService } from '../livesession.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ZegoUIKitPrebuilt, ScenarioModel } from '@zegocloud/zego-uikit-prebuilt';
import { en } from '../en';
import { ar } from '../ar';

@Component({
  selector: 'app-join-live-session',
  templateUrl: './join-live-session.component.html',
})
export class JoinLiveSessionComponent implements OnInit {
  sessions: any[] = [];
  selectedSession: any = null;
  successMessage: string = '';
  errorMessage: string = '';

  @ViewChild('videoContainer', { static: false }) videoContainer!: ElementRef;

  constructor(
    private liveService: LivesessionService,
    private translate: TranslateService
  ) {
    // تحميل ملفات الترجمة
    this.translate.setTranslation('en', en, true);
    this.translate.setTranslation('ar', ar, true);
    this.translate.setDefaultLang('en');
    this.translate.use('en'); // أو 'ar' حسب اللغة الحالية
  }

  ngOnInit(): void {
    this.loadSessions();

    // تحديث النصوص عند تغيير اللغة
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.loadSessions();
    });
  }

  loadSessions() {
    this.liveService.getUpcomingSessions().subscribe((res: any) => {
      if (res.status) this.sessions = res.innerData;
    });
  }

  joinSession(sessionId: number) {
    this.liveService.joinSession(sessionId).subscribe({
      next: (res: any) => {
        if (res.status && res.innerData) {
          this.successMessage = this.translate.instant('LIVE_SESSION.JOIN_SUCCESS');
          this.errorMessage = '';
          this.showMessageForLimitedTime();
          this.selectedSession = res.innerData;
          this.startVideo(res.innerData);
        } else {
          this.errorMessage = res.message || this.translate.instant('LIVE_SESSION.JOIN_FAILED');
          this.successMessage = '';
          this.showMessageForLimitedTime();
        }
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || this.translate.instant('LIVE_SESSION.JOIN_FAILED');
        this.successMessage = '';
        this.showMessageForLimitedTime();
      }
    });
  }

  startVideo(data: any) {
    try {
      const kitToken = data.token; 
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: this.videoContainer.nativeElement,
        scenario: { mode: ScenarioModel.GroupCall },
        sharedLinks: [
          {
            name: this.translate.instant('LIVE_SESSION.JOIN_ROOM'),
            url: `${window.location.origin}${window.location.pathname}?roomID=${data.roomId}`,
          },
        ],
      });
    } catch (err) {
      console.error('Error starting video', err);
    }
  }

  cancelSession(sessionId: number) {
    this.liveService.cancelSession(sessionId).subscribe((res: any) => {
      if (res.status) {
        this.sessions = this.sessions.filter(s => s.id !== sessionId);
        this.successMessage = this.translate.instant('LIVE_SESSION.CANCEL_SUCCESS');
        this.errorMessage = '';
        this.showMessageForLimitedTime();
      } else {
        this.errorMessage = res.message || this.translate.instant('LIVE_SESSION.CANCEL_FAILED');
        this.successMessage = '';
        this.showMessageForLimitedTime();
      }
    });
  }

  private showMessageForLimitedTime() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 10000); // 10 ثواني
  }
}
