import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { TitleService } from './shared/title/title.service';


@Component({
  selector: 'yc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  defaultTitle = 'YANG Catalog';

  constructor(
    private titleService: TitleService,
    private title: Title,
    private tracker: MatomoTracker) { }

  ngOnInit() {
    this.titleService.boot()
      .subscribe((title: string) => {
        const pageTitle = title ? `${title} - ${this.defaultTitle}` : this.defaultTitle;
        this.title.setTitle(pageTitle);
        this.tracker.trackPageView(pageTitle);
      });
  }
}
