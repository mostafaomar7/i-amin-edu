import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportanalysisComponent } from './reportanalysis.component';

describe('ReportanalysisComponent', () => {
  let component: ReportanalysisComponent;
  let fixture: ComponentFixture<ReportanalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportanalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
