import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../core/data.service';

@Injectable({
  providedIn: 'root'
})
export class YangImplementationsService extends DataService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getImplementations(vendor: string, platform: string): Observable<any> {
    return this.customGet(`api/search/vendors/vendor/${vendor}/platforms/platform/${platform}`);
  }
}
