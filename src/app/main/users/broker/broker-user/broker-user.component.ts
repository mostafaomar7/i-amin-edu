import { Component, Input, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-broker-user',
  templateUrl: './broker-user.component.html',
  styleUrls: ['./broker-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BrokerUserComponent implements OnInit, AfterViewInit {
  @Input() hasHeader: boolean = true;

  public isLoading = true;
  public rows: any[] = [];
  public selectedOption = 10;
  public ColumnMode = ColumnMode;   // مهم جداً للـ ngx-datatable
  public searchValue = '';

  constructor(private router: Router,) {}

  ngOnInit(): void {
    this.rows = [
    { id: 1, name: 'Ahmed Ali', phone: '01012345678', role: 'instructor', status: 'Active' },
    { id: 2, name: 'Sara Mohamed', phone: '01198765432', role: 'organizaton', status: 'Inactive' },
    { id: 3, name: 'Omar Hassan', phone: '01234567890', role: 'instructor', status: 'Active' }
  ];
  }

  ngAfterViewInit(): void {
    feather.replace(); // علشان يحوّل [data-feather] → SVG
  }

  filterUpdate(event: any) {
    const val = event.target.value.toLowerCase();
    this.rows = this.rows.filter(d =>
      d.id.toString().toLowerCase().indexOf(val) !== -1 || !val
    );
  }

  addItem() {
    this.router.navigate([`newuser-broker`]);
  }
  eyeRoute(){
    this.router.navigate([`userinfo-broker`])
  }
}
