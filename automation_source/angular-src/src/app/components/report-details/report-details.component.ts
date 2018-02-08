import { Component, OnInit, OnChanges , Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResultService } from '../../services/result.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css'],
  providers: [ResultService]
})
export class ReportDetailsComponent implements OnInit, OnChanges {
  metadata; initials; specSprint;
  filename;
  @Input() passCount: number;
  @Input() failCount: number;
  constructor(private http: HttpClient, private resultService: ResultService, private activeRoute: ActivatedRoute) { }
  initialConditionsVerification() {
    if (this.initials.deviceOnline === null) {
      if (this.initials.saidClaimed === null) {
        if (this.initials.loginTwo === null) {
          if (this.initials.loginOne === null) {
            return 'Waiting for First Login';
          }
          return 'Done Login One';
        }
        return 'Done Login Two';
      }
      return 'Checked SAID Claimed Status';
    }
    return 'Checked Device Online Status';
  }
  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.filename = params['id'];
    });
    this.resultService.getMegaThrowReportFromID(this.filename).subscribe(data => {
      this.metadata = data.metadata;
      this.initials = data.initials;
      this.specSprint = data.specSprint;
    }
    );
  }

  ngOnChanges() {
    this.activeRoute.params.subscribe(params => {
      this.filename = params['id'];
    });
  }
}
