import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SoftwareVersion, YangPlatformData } from './models/yang-platform-data';
import { YangImplementationsService } from './yang-implementations.service';

@Component({
  selector: 'yc-yang-implementations',
  templateUrl: './yang-implementations.component.html',
  styleUrls: ['./yang-implementations.component.scss']
})
export class YangImplementationsComponent implements OnInit, OnDestroy {
  vendor = ''
  platform = '';
  title = 'YANG Implementations >> '
  selectedVersionName = '';
  softwareVersions: SoftwareVersion[];
  selectedVersion: SoftwareVersion;
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
          this.title += this.vendor + ' >> ' + this.platform;
          this.loadImplementationsdata();
        }
      );
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }

  onSoftwareVersionClick(index) {
    this.selectedVersion = this.softwareVersions[index];
    this.selectedVersionName = this.selectedVersion.name;
  }

  private loadImplementationsdata() {
    this.loading = true;
    this.dataService.getImplementations(this.vendor, this.platform).pipe(
      finalize(() => this.loading = false),
      takeUntil(this.componentDestroyed)
    ).subscribe(platform => {
      const data = new YangPlatformData(platform['yang-catalog:platform'][0]);
      this.softwareVersions = data.getSoftwareVersions();
      this.softwareVersions = this.softwareVersions.sort((a, b) => (a.name > b.name) ? 1 : -1);
      this.selectedVersion = this.softwareVersions[0];
      this.selectedVersionName = this.selectedVersion.name;
    },
      err => {
        this.error = err;
      }
    );
  }
}
