import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerUserComponent } from './broker-user.component';

describe('BrokerUserComponent', () => {
  let component: BrokerUserComponent;
  let fixture: ComponentFixture<BrokerUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
