import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveroomComponent } from './liveroom.component';

describe('LiveroomComponent', () => {
  let component: LiveroomComponent;
  let fixture: ComponentFixture<LiveroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveroomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
