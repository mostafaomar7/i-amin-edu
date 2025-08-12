import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinLiveSessionComponent } from './join-live-session.component';

describe('JoinLiveSessionComponent', () => {
  let component: JoinLiveSessionComponent;
  let fixture: ComponentFixture<JoinLiveSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinLiveSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinLiveSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
