import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokersViewComponent } from './brokers-view.component';

describe('BrokersViewComponent', () => {
  let component: BrokersViewComponent;
  let fixture: ComponentFixture<BrokersViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokersViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
