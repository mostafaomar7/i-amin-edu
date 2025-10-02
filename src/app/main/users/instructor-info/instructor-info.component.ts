import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstructorsListService } from '../instructors/instructors-list.service';
import feather from 'feather-icons';

@Component({
  selector: 'app-instructor-info',
  templateUrl: './instructor-info.component.html',
  styleUrls: ['./instructor-info.component.scss']
})
export class InstructorInfoComponent implements OnInit, AfterViewInit {

  public isLoading = true;
  instructorId: string = "0";
  instructorData: any;
  statistics: any;

  constructor(
    private route: ActivatedRoute,
    private _instructorsListService: InstructorsListService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getInstructor(id);
      this.getStatistics(id);
    }
  }

  ngAfterViewInit() {
    // تفعيل الأيقونات بعد ما يترندر الـ HTML
    feather.replace();
  }

  async getInstructor(id: string) {
    this.isLoading = true;
    await this._instructorsListService.getItem(id).then((response: any) => {
      this.isLoading = false;
      if (response.status) {
        this.instructorData = response.innerData;
        this.instructorId = response.innerData.id;
      }
    });
  }

  async getStatistics(id: string) {
  await this._instructorsListService.getStatistics(id).then((res: any) => {
    if (res.status) {
      this.statistics = res.innerData;
      setTimeout(() => feather.replace(), 0); // تحديث الأيقونات بعد تحميل البيانات
    }
  });
}

}
