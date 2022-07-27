import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'yc-api-overview',
  templateUrl: './api-overview.component.html',
  styleUrls: ['./api-overview.component.scss']
})
export class ApiOverviewComponent implements OnInit {

  myBaseUrl = environment.WEBROOT_BASE_URL;

  constructor() { }

  ngOnInit(): void {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

}
