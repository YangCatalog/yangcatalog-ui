import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from '../../core/data.service';
import { YangStatsModel } from '../statistics/models/yang-stats-model';

@Injectable({
  providedIn: 'root'
})
export class PrivateService extends DataService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getStats(): Observable<YangStatsModel> {
    return this.customGet('api/get-statistics').pipe(
      map(res => {
        return new YangStatsModel(res);
      })
    );
  }

  getProblematicDrafts(): Observable<any> {
    return this.customGet('api/problematic-drafts').pipe(
      map(response => Object.keys(response).map(key => {
        return {
          'draftName': key,
          'xymError': response[key]
        }
      }))
    );
  }

  getPrivateJson(): Observable<any> {
    return this.customGet('private/private.json');
  }

  getValidatorsVersions(): Observable<any> {
    return this.customGet('yangvalidator/v2/versions');
  }

  loadData(jsonFile: string): Observable<any> {
    return this.customGet('private/' + jsonFile);
  }

  loadAndTransformObjData(jsonFile: string): Observable<any> {
    return this.customGet('private/' + jsonFile).pipe(
      map(response => this.transformObjDataToRows(response))
    );
  }

  loadAndTransformRfcObjData(jsonFile: string): Observable<any> {
    return this.customGet('private/' + jsonFile).pipe(
      map(response => Object.keys(response).map(key => [key, response[key]]))
    );
  }

  loadAndTransformStatisticsObjData(jsonFile: string): Observable<any> {
    return this.customGet('private/' + jsonFile).pipe(
      map(response => Object.keys(response).map(key => [key].concat(Object.keys(response[key]).map(key2 => response[key][key2]))))
    );
  }

  loadAndGetStatisticsForOneType(jsonFile: string, type: string): Observable<any> {
    return this.customGet('private/' + jsonFile).pipe(
      map(response => response[type])
    );
  }

  private transformObjDataToRows(objData: any) {
    const result = Object.keys(objData).map(key => {
      objData[key].unshift(key);
      return objData[key];
    });
    return result;
  }
}
