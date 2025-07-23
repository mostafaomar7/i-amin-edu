import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss']
})
export class CourseOverviewComponent implements OnInit {

  @Input() course: any;

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
