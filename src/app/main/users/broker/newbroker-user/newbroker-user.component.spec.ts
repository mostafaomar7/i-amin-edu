import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewbrokerUserComponent } from './newbroker-user.component';

describe('NewbrokerUserComponent', () => {
  let component: NewbrokerUserComponent;
  let fixture: ComponentFixture<NewbrokerUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewbrokerUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewbrokerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
