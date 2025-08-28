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
      if (res.status) this.sessions = res.innerData || [];
    });
  }

  enterRoom() {
    this.route.navigateByUrl(`/room/${this.roomId}`);
  }

  joinSession(sessionId: number) {
    this.selectedSession = null;
    this.errorMessage = '';
    this.successMessage = '';

    this.liveService.joinSession(sessionId).subscribe({
      next: (res: any) => {
        console.log('Full API Response:', res);

        const kitTokenObj = res?.innerData?.kitToken;

        if (kitTokenObj) {
          try {
            // توليد kitToken من Angular
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
              Number(kitTokenObj.appID),
              kitTokenObj.token,
              kitTokenObj.roomID,
              kitTokenObj.userID,
              kitTokenObj.userName
            );

            this.roomId = kitTokenObj.roomID;
            this.selectedSession = res.innerData;

            // فحص صلاحيات الميكروفون والكاميرا قبل الانضمام
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
              .then(() => {
                setTimeout(() => {
                  const zp = ZegoUIKitPrebuilt.create(kitToken);
                  zp.joinRoom({
                    container: this.videoContainer.nativeElement,
                    sharedLinks: [
                      { name: 'Personal link', url: window.location.href }
                    ],
                    scenario: { mode: ZegoUIKitPrebuilt.GroupCall },
                    showScreenSharingButton: true,
                    turnOnCameraWhenJoining: true,
                    turnOnMicrophoneWhenJoining: true,
                    showTextChat: true,
                    showRoomTimer: true,
                  });
                  this.successMessage = 'تم الانضمام للجلسة بنجاح';
                }, 0);
              })
              .catch(() => {
                this.errorMessage = 'يرجى السماح بالوصول للكاميرا والميكروفون.';
              });

          } catch (e) {
            console.error(e);
            this.errorMessage = 'فشل الانضمام للجلسة (UIKit).';
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
