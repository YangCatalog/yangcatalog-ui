import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ModuleDetailsModel } from '../yang-module-details/models/module-details-model';
import { YangImplementationsService } from './yang-implementations.service';

@Component({
  selector: 'yc-yang-implementations',
  templateUrl: './yang-implementations.component.html',
  styleUrls: ['./yang-implementations.component.scss']
})
export class YangImplementationsComponent implements OnInit, OnDestroy {
  vendor = ''
  platform = '';
  loading = false;
  myBaseUrl = environment.WEBROOT_BASE_URL;
  error: any;

  private componentDestroyed: Subject<void> = new Subject<void>();

  constructor(private dataService: YangImplementationsService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe(
        (params: Params) => {
          this.vendor = params['vendor'];
          this.platform = params['platform'];
          this.loadImplementationsdata();
        }
      );
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }

  private loadImplementationsdata() {
    this.loading = true;
    this.dataService.getImplementations(this.vendor, this.platform).pipe(
      takeUntil(this.componentDestroyed)
    ).subscribe(
      res => {
        console.log(res)
      },
      err => {
        this.error = err;
        this.loading = false;
      }
    );
  }
}
