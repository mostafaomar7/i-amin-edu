// join-live-session.component.ts
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { LivesessionService } from '../livesession.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-join-live-session',
  templateUrl: './join-live-session.component.html',
})
export class JoinLiveSessionComponent implements OnInit, OnDestroy {
  sessions: any[] = [];
  selectedSession: any = null;
  successMessage = '';
  errorMessage = '';

  @ViewChild('localVideo', { static: false }) localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo', { static: false }) remoteVideo!: ElementRef<HTMLVideoElement>;

  private langSub?: Subscription;
  private zg!: ZegoExpressEngine;

  constructor(
    private liveService: LivesessionService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadSessions();
    this.langSub = this.translate.onLangChange.subscribe((_event: LangChangeEvent) => {
      this.loadSessions();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.zg?.destroyEngine();
  }

  loadSessions() {
    this.liveService.getUpcomingSessions().subscribe((res: any) => {
      if (res.status) {
        this.sessions = res.innerData || [];
      }
    });
  }

  async joinSession(sessionId: number) {
    this.selectedSession = null;
    this.errorMessage = '';
    this.successMessage = '';

    this.liveService.joinSession(sessionId).subscribe({
      next: async (res: any) => {
        console.log('API response:', res);

        const data = res?.innerData;
        if (res.status && data?.token && data?.roomId && data?.appId && data?.userId) {
          this.selectedSession = data;

          try {
            const appId = Number(data.appId);

            if (!appId || isNaN(appId)) {
              this.errorMessage = 'Invalid App ID received from server.';
              return;
            }

            // Initialize Zego engine
                this.zg = new ZegoExpressEngine(appId, "wss://webliveroom.zego.im/ws");


             

            // Login with server-provided token & userId
            await this.zg.loginRoom(data.roomId, data.token, {
              userID: data.userId.toString(),
              userName: 'Guest User',
            });
            console.log('Trying to login:', {
              appId,
              roomId: data.roomId,
              token: data.token,
              userID: data.userId,
              userName: 'Guest User'
            });
            // Create local stream
            const localStream = await this.zg.createStream({ camera: { video: true, audio: true } });
            this.localVideo.nativeElement.srcObject = localStream;
            this.localVideo.nativeElement.play();
            this.zg.startPublishingStream('stream1', localStream);

            // Handle remote streams
            this.zg.on('roomStreamUpdate', async (_roomID, updateType, streamList) => {
              if (updateType === 'ADD' && streamList.length) {
                const remoteStream = await this.zg.startPlayingStream(streamList[0].streamID);
                this.remoteVideo.nativeElement.srcObject = remoteStream;
                this.remoteVideo.nativeElement.play();
              }
            });

            this.successMessage = 'Joined session successfully!';
          } catch (err) {
            console.error('Zego init error:', err);
            this.errorMessage = 'Failed to initialize video session.';
          }
        } else {
          this.errorMessage = 'Incomplete session details from server.';
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'An error occurred while joining the session.';
      },
    });
  }
}
