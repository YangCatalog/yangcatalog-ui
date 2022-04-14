import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../core/data.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends DataService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  createUser(input: any): Observable<any> {
    return this.post('api/register-user', input);
  }
}
