import { Component, ElementRef, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

@Component({
  selector: 'app-liveroom',
  templateUrl: './liveroom.component.html',
  styleUrls: ['./liveroom.component.scss']
})
export class LiveroomComponent implements OnInit, AfterViewInit {
  constructor() { }

  @ViewChild('root')
  root!: ElementRef;
  roomID : string = "";
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.roomID =  param['roomId'];
    });
  }

  ngAfterViewInit(): void {
    const appID =  1053222872;
   const serverSecret = "cc93d6e83106d22b950b4fbff6144a67";
   const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, this.roomID,  'UDG',  Date.now().toString());

      // Create instance object from Kit Token.
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: this.root.nativeElement,
        sharedLinks: [
          {
            name: 'Personal link',
            url:
            window.location.protocol + '//' + 
            window.location.host + window.location.pathname +
              '?roomID=' +
              this.roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
      });
  }
}
