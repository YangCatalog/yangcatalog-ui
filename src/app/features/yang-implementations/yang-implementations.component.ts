import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { YangImplementationsService } from './yang-implementations.service';

@Component({
  selector: 'yc-yang-implementations',
  templateUrl: './yang-implementations.component.html',
  styleUrls: ['./yang-implementations.component.scss']
})
export class YangImplementationsComponent implements OnInit, OnDestroy {
  path = ''
  moduleName = '';
  revision = '';
  implementations: [];
  loading = false;
  myBaseUrl = environment.WEBROOT_BASE_URL;
  error: any;
  private componentDestroyed: Subject<void> = new Subject<void>();

  constructor(private dataService: YangImplementationsService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe(
        (params: Params) => {
          if (params.hasOwnProperty('module')) {
            const moduleArr = params['module'].split('@');
            this.path = moduleArr;
            this.moduleName = moduleArr[0];
            this.revision = moduleArr[1];
            this.loadImplementationsdata();
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }

  private loadImplementationsdata() {
    this.loading = true;
    let requestModuleName = this.moduleName;
    if (this.revision) {
      requestModuleName += '@' + this.revision;
    }
    this.dataService.getImplementations(requestModuleName).pipe(
      takeUntil(this.componentDestroyed)
    ).subscribe(
      res => {
        res.data['implementations'] = {
          "implementation": [
            {
              "conformance-type": "implement",
              "deviation": [
                {
                  "name": "huawei-aaa-deviations-ATN-980B",
                  "revision": "2019-04-23"
                }],
              "feature-set": "ALL",
              "os-type": "VRP",
              "os-version": "V800R021C00",
              "platform": "atn-980b",
              "software-flavor": "ALL",
              "software-version": "V800R021C00",
              "vendor": "huawei"
            },
            {
              "conformance-type": "implement",
              "deviation": [
                {
                  "name": "huawei-aaa-deviations-OC-NE-X8X16",
                  "revision": "2019-04-23"
                }],
              "feature-set": "ALL",
              "os-type": "VRP",
              "os-version": "V800R021C00",
              "platform": "ne40e-x8x16",
              "software-flavor": "ALL",
              "software-version": "V800R021C00",
              "vendor": "huawei"
            },
            {
              "conformance-type": "implement",
              "deviation": [
                {
                  "name": "huawei-aaa-deviations-NE8000M8M14",
                  "revision": "2019-04-23"
                }],
              "feature-set": "ALL",
              "os-type": "VRP",
              "os-version": "V800R021C00",
              "platform": "ne8000-m8",
              "software-flavor": "ALL",
              "software-version": "V800R021C00",
              "vendor": "huawei"
            }]
        }
        this.implementations = res.data['implementations']['implementation']
        console.log(res)
      },
      err => {
        this.error = err;
        this.loading = false;
      }
    );
  }
}
