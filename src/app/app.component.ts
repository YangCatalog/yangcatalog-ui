import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'yc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  defaulTitle = 'YANG Catalog';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let routeTitle = '';
          while (this.activatedRoute!.firstChild) {
            this.activatedRoute = this.activatedRoute.firstChild;
          }
          if (this.activatedRoute.snapshot.data['title']) {
            routeTitle = this.activatedRoute!.snapshot.data['title'];
          }
          return routeTitle;
        })
      )
      .subscribe((title: string) => {
        if (title) {
          this.titleService.setTitle(`${title} - ${this.defaulTitle}`);
        } else {
          this.titleService.setTitle(this.defaulTitle);
        }
      });
  }
}
