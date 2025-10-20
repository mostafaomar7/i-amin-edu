import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss']
})
export class CourseOverviewComponent implements OnInit {

  @Input() course: any;
currency: string = '';

  constructor(
  ) { }

  ngOnInit(): void {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const countryId = userData?.countryId;

  if (countryId === 1) {
    this.currency = 'EGP';
  } else if (countryId === 2) {
    this.currency = 'SAR';
  } 
}


}
