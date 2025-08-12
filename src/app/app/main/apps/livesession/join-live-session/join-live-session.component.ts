import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LivesessionService } from '../livesession.service';
import { ZegoUIKitPrebuilt, ScenarioModel } from '@zegocloud/zego-uikit-prebuilt';

@Component({
  selector: 'app-join-live-session',
  templateUrl: './join-live-session.component.html',
})
export class JoinLiveSessionComponent implements OnInit {
  sessions: any[] = [];
  selectedSession: any = null;

  @ViewChild('videoContainer', { static: false }) videoContainer!: ElementRef;

  constructor(private liveService: LivesessionService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions() {
    this.liveService.getUpcomingSessions().subscribe((res: any) => {
      if (res.status) this.sessions = res.innerData;
    });
  }

  joinSession(sessionId: number) {
    this.liveService.joinSession(sessionId).subscribe((res: any) => {
      if (res.status && res.innerData) {
        this.selectedSession = res.innerData;
        this.startVideo(res.innerData);
      }
    });
  }

  startVideo(data: any) {
  try {
    const kitToken = data.token; 

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: this.videoContainer.nativeElement,
      scenario: {
        mode: ScenarioModel.GroupCall,
      },
      sharedLinks: [
        {
          name: 'Join Room',
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
    } else {
      console.error('Failed to cancel session', res.message);
    }
  });
}


}
