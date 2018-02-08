import { Component, OnInit } from '@angular/core';
import { ActionService } from '../../services/action.service';
import { ResultService } from '../../services/result.service';

@Component({
  selector: 'unified-model',
  templateUrl: './unified-model.component.html',
  styleUrls: ['./unified-model.component.css']
})
export class UnifiedModelComponent implements OnInit {
  inputs; filename; showIcon; isPending; reportStatus = []; displayListRefresh = true;
  constructor(private action: ActionService, private resultService: ResultService) { }
  getInputsArray() {
    return new Promise((resolve, reject) => {
    this.action.getListOfInputFiles().subscribe(data => {
      this.inputs = data;
      resolve(data);
    },
      err => {
        reject();
      });
    });
  }

  getInputsArrayV2() {
    this.action.getListOfInputFiles().subscribe(data => {
    this.inputs = data;
      this.reportStatus = [];
      data.forEach((filename) => {
        this.getReportStatusV2(filename);
      });
      console.log(this.reportStatus);
    },
      err => {
        return err;
      });
  }

  getReportStatusV2(filename: string) {
    let running;
    let finishedAt: any;
    this.resultService.getMetadataFromInputFilename(filename).subscribe(data => {
      running = data.running;
      finishedAt = data.finishedAt;
      if (running === true && finishedAt === null) {
        this.reportStatus.push({ status: 'running', completedAt: finishedAt });
        return;
      }
      if (running === 'forcefully_closed' && finishedAt === null) {
        this.reportStatus.push({ status: 'forcefully_closed', completedAt: finishedAt });
        return;
      }
      if (running === false && finishedAt !== null) {
        this.reportStatus.push({ status: 'completed', completedAt: finishedAt });
        return;
      }
      if (running === false && finishedAt === null) {
        this.reportStatus.push({ status: 'not_started', completedAt: finishedAt });
        return;
      }
    });
  }
  onStartExecutionClick() {
    this.action.startSequentialExecution().subscribe(data => {
      console.log('Hit in');
      console.log(data);
      this.displayListRefresh = false;
      localStorage.setItem('displayListRefresh', JSON.stringify(false));
    }, err => {
      // console.log('Hit in');
      // console.log(err);
      // this.displayListRefresh = false;
      // localStorage.setItem('displayListRefresh', JSON.stringify(false));
      return err;
    });
  }
  fetchReportStatus() {
    this.inputs.forEach(file => {
      console.log('filename is ' + file);
      this.resultService.getReportStatus(file).subscribe(data => {
        this.reportStatus.push(data);
        console.log('data recieved is: ' + data);
      });
    });
  }

  onReload() {
    location.reload(true);
  }

  getListOfInputFiles() {
    this.action.fromInputCreateBatchAndMegathrows().subscribe(data => {
      this.onReload();
    });
  }
  onRestartClick(){
    this.displayListRefresh = true;
    localStorage.setItem('displayListRefresh', JSON.stringify(true));
    this.onReload();
  }

  ngOnInit() {
    if (localStorage.displayListRefresh) {
      this.displayListRefresh = JSON.parse(localStorage.displayListRefresh);
    }
    // this.getInputsArray().then((data) => {
    //   this.fetchReportStatus();
    // });
    this.getInputsArrayV2();
  }

}
