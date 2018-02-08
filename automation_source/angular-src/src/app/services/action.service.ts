import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Result } from '../result';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class ActionService {

  constructor(private http: HttpClient) { }

  updateSeleniumServer(): Observable<any> {
    return this.http.get<any>(`${environment.url}/actions/update/server`);
  }

  startSeleniumServer(): Observable<any> {
    return this.http.get<any>(`${environment.url}/actions/start/server`);
  }
  fromInputCreateBatchAndMegathrows(): Observable<any> {
    return this.http.get<any>(`${environment.url}/actions/create/seqexecfile`);
  }
  getListOfInputFiles(): Observable<any> {
    return this.http.get<any>(`${environment.url}/actions/inputlist`).pipe(
      map(data => data.inputFiles)
    );
  }

  startSequentialExecution(): Observable<any> {
    return this.http.get<any>(`${environment.url}/actions/start/execution`).pipe(
      map(data => JSON.parse(data))
    );
  }

}

class ExecutionInfo {
  inputFiles: any[];
}
