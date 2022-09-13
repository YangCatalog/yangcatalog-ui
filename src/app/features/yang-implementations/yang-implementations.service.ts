import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../core/data.service';
import { ModuleDetailsModel } from '../yang-module-details/models/module-details-model';

@Injectable({
  providedIn: 'root'
})
export class YangImplementationsService extends DataService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  // TODO: Same endpoint is used for now - maybe add separate endpoint
  getImplementations(moduleName: string): Observable<ModuleDetailsModel> {
    return this.getOneModel('api/yang-search/v2/module-details/' + moduleName, ModuleDetailsModel);
  }
}
