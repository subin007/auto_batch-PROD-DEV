import { Injectable } from '@angular/core';
import { Result } from '../result';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class ResultService {
  private heroesUrl = 'assets/data.json';
  private resultsUrl = 'assets/result.json';
  private testRunResult = 'assets/result.json';
  private megaThrowReport = 'assets/mega-throw.v2.json';
  // private outputLocation = '../../core/outputs/';
  private outputLocation = 'assets/';
  public failedResultsCount = 0;
  public passedResultsCount = 0;
  constructor(private http: HttpClient) {}
  getResults(): Observable<Result[]> {
    return this.http.get<Result[]>(this.testRunResult).pipe(
      // tap(heroes => this.log('fetched heroes')),
      // catchError(this.handleError('getHeroes', []))
      map(data => data)
    );
  }
  getMegaThrowReport(): Observable<Result> {
    return this.http.get<Result>(this.megaThrowReport).pipe(
      // tap(heroes => this.log('fetched heroes')),
      // catchError(this.handleError('getHeroes', []))
      map(data => data)
    );
  }

  getMegaThrowReportFromID(id: string): Observable<Result> {
    console.log("this is the id" + id);
    const location = `assets/core/outputs/${id}`;
    return this.http.get<Result>(location).pipe(map(data => data));
  }

  getMetadataFromInputFilename(filename: string): Observable<any> {
    const location = `assets/core/outputs/${filename}`;
    return this.http.get<Result>(location).pipe(map(data => data.metadata));
  }

  getReportStatus(filename: string): Observable<any[]> {
    let running;
    let finishedAt: any;
    this.getMetadataFromInputFilename(filename).subscribe(data => {
      console.log(`metadata from the file ${filename} is`);
      console.log(data)
      running = data.running;
      finishedAt = data.finishedAt;
    });
    if (running === true && finishedAt === null) {
      return of(['running', finishedAt]);
    }
    if (running === 'forcefully_closed' && finishedAt === null) {
      return of(['forcefully_closed', finishedAt ]);
    }
    if (running === false && finishedAt !== null) {
      return of(['completed', finishedAt ]);
    }
    if (running === false && finishedAt === null) {
      return of(['not_started', finishedAt ]);
    }
  }

  failedResultsCountIncrement(): number {
    return ++this.failedResultsCount;
  }
  passedResultsCountIncrement(): number {
    return ++this.passedResultsCount;
  }
}

class ReportStatus {
  reportStatus: string;
  completedAt: any;
}
