import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResultService } from '../../services/result.service';
import { ActionService } from '../../services/action.service';


@Component({
  selector: 'report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [ResultService]
})
export class ReportComponent implements OnInit, OnChanges {
  results; redShift; metadata; initials; specSprint;
  testcaseprev = null; failedResultsCount = 0; passedResultsCount = 0;
  displayCaseName = true; actualValueArray = []; failureReason = [];
  filename;
  constructor(private http: HttpClient, private resultService: ResultService, private actions: ActionService, private activeRoute: ActivatedRoute) { }
  ngOnChanges() {
    this.activeRoute.params.subscribe(params => {
      this.filename = params['id'];
    });
    // this.failureReasonGeneration();
  }
  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.filename = params['id'];
    });
    this.failedResultsCount = 0;
    this.passedResultsCount = 0;
    this.testcaseprev = null;
    // this.resultService.getMegaThrowReport().subscribe(data => {
    //   this.metadata = data.metadata;
    //   this.initials = data.initials;
    //   this.specSprint = data.specSprint;
    //   this.specSprint.forEach(spec => {
    //     if ((spec.failResults.length === 0) && (spec.passResults.length !== 0)) { this.passedResultsCount++; }
    //     if (spec.failResults.length !== 0) { this.failedResultsCount++; }
    //   });
    // }
    // );

    this.resultService.getMegaThrowReportFromID(this.filename).subscribe(data => {
      console.log('There there' + this.filename);
      this.metadata = data.metadata;
      this.initials = data.initials;
      this.specSprint = data.specSprint;
      this.specSprint.forEach(spec => {
        if ((spec.failResults.length === 0) && (spec.passResults.length !== 0)) { this.passedResultsCount++; }
        if (spec.failResults.length !== 0) { this.failedResultsCount++; }
      });
    }
    );
  }

  failureReasonGeneration() {
    if (this.initials.loginOne === false && this.initials.loginTwo === false && this.initials.saidClaimed === false && this.initials.deviceOnline === false) {
      this.failureReason = [];
      this.failureReason.push('The site is not accessible');
    }
    if (this.initials.loginOne === false && (this.initials.loginTwo === null || this.initials.saidClaimed === null || this.initials.deviceOnline === null)) {
      this.failureReason.push('For First Login, User ID or Password might be wrong');
    }
    if (this.initials.loginTwo === false && (this.initials.saidClaimed === null || this.initials.deviceOnline === null)) {
      this.failureReason.push('For Second Login, User ID or Password might be wrong');
    }
    if (this.initials.saidClaimed === false && (this.initials.deviceOnline === null)) {
      this.failureReason.push('SAID is UNCLAIMED');
    }
    if (this.initials.deviceOnline === false && (this.initials.loginOne === true || this.initials.loginTwo === true || this.initials.saidClaimed === true || this.initials.deviceOnline === true)) {
      this.failureReason.push('Device is OFFLINE');
    }
    console.log('failureReason' + this.failureReason);
  }


  resultStatus(failResults, passResults) {
    if (failResults.length === 0) {
      return 'Pass';
    } if (failResults.length > 0) {
      return 'Fail';
    }
  }
  displayTestcaseName(testcaseName, index) {
    if (index === 0) {
      this.testcaseprev = testcaseName;
      return true;
    }
    if (this.testcaseprev !== testcaseName) {
      this.testcaseprev = testcaseName;
      return true;
    }
    if (this.testcaseprev === testcaseName) {
      return false;
    }
  }

  operationFailureStatements(code, attributeName, matcherName, actual, expected) {
    switch (code) {
      case 'sgv':
        return `Get Current value of ${attributeName}, where expected value was ${expected}, but value present was ${actual}`;
      case 'ssv':
        return `Set Value of ${attributeName} to ${expected}, where updation was not successfull, value reverted to ${actual}`;
      case 'sgr':
        const statementS = matcherName === 'toBeGreaterThanOrEqual' ? 'is lesser than lower range' : 'is greater than upper range';
        return `Get value of ${attributeName} inside specified range, where ${actual} ${statementS} ${expected}`;
      case 'sgh':
        return `Check the history value of ${attributeName}, where expected value was  ${expected}, but value present was ${actual}`;
      case 'mg':
        return `Not able to push(GET) the attributes in Multi Attribute Tab`;
      case 'msv':
        return `Not able to SET the attributes in Multi Attribute Tab`;
      case 'dgv':
        return `Dependent Attribute ${attributeName}, value expected was ${expected}, but value present ${actual}`;
      case 'dgt':
        return `Dependent Attribute ${attributeName}, updation time expected was ${expected}, but value present ${actual}`;
      case 'dgr':
        const statementD = matcherName === 'toBeGreaterThanOrEqual' ? 'is lesser than lower range' : 'is greater than upper range';
        return `Dependent Attribute ${attributeName} inside specified range, where ${actual} ${statementD} ${expected}`;
    }
  }
  operationStatements(code, expected) {
    switch (code) {
      case 'sgv':
        return `GET (Current value), Expected: ${expected}`;
      case 'ssv':
        return `SET (Current value) to ${expected}`;
      case 'sgr':
        return `GET (value within range), Expected Range: ${expected}`;
      case 'sgh':
        return `GET/Verify (History value)`;
      case 'mg':
        return `Multi GET`;
      case 'msv':
        return `Multi SET`;
      case 'dgv':
        return `Dependent Attribute: GET/Verify (Current value), Expected: ${expected}`;
      case 'dgt':
        return `Dependent Attribute: GET/Verify (Updation Time), Expected: ${expected}`;
      case 'dgr':
        return `Dependent Attribute: GET/Verify (value in range), Expected Range: ${expected}`;
    }
  }
  actualValueArrayFunc(failResults, passResults) {
    this.actualValueArray = [];
    if (failResults.length >= 0 && passResults.length === 0) {
      failResults.forEach(result => {
        this.actualValueArray.push(result.expected);
      });
    }
    if (passResults.length >= 0 && failResults.length === 0) {
      passResults.forEach(result => {
        this.actualValueArray.push(result.expected);
      });
    }
    if (passResults.length >= 0 && failResults.length >= 0) {
      failResults.forEach(result => {
        this.actualValueArray.push(result.expected);
      });
      passResults.forEach(result => {
        this.actualValueArray.push(result.expected);
      });
    }
    return this.actualValueArray;
  }

}
