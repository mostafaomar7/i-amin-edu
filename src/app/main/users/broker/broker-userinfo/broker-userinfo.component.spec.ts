import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerUserinfoComponent } from './broker-userinfo.component';

describe('BrokerUserinfoComponent', () => {
  let component: BrokerUserinfoComponent;
  let fixture: ComponentFixture<BrokerUserinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerUserinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokerUserinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
