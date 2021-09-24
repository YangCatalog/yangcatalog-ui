import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from '../../core/data.service';
import { ModuleDetailsModel } from './models/module-details-model';
import { ModuleInfoMetaDataModel } from './models/module-info-meta-data-model';

@Injectable({
  providedIn: 'root'
})
export class YangModuleDetailsService extends DataService {

  moduleInfoHelp: ModuleInfoMetaDataModel;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getModuleAutocomplete(searchStr: string): Observable<any> {
    return this.customGet('api/yang-search/v2/completions/module/' + searchStr);
  }

  getModuleInfoHelp(): Observable<ModuleInfoMetaDataModel> {
    if (this.moduleInfoHelp) {
      return of(this.moduleInfoHelp);
    } else {
      return this.getOneModel('api/yang-search/v2/yang-catalog-help', ModuleInfoMetaDataModel).pipe(
        map(infoData => {
          this.moduleInfoHelp = infoData;
          return infoData;
        })
      );
    }
  }

  getModuleDetails(moduleName: string): Observable<ModuleDetailsModel> {
    return this.getOneModel('api/yang-search/v2/module-details/' + moduleName, ModuleDetailsModel);
  }
}
