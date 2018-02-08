import { Component, OnInit } from '@angular/core';
import { ActionService } from '../../services/action.service';
import { ResultService } from '../../services/result.service';

@Component({
  selector: 'master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {
  inputs; filename; showIcon; isPending; reportStatus = [];
  constructor(private action: ActionService, private resultService: ResultService) { }
  getInputsArray() {
    this.action.getListOfInputFiles().subscribe(data => { this.inputs = data; },
       err =>  {
         return err;
        });
  }
  onUpdateServerClick(){
    this.action.updateSeleniumServer().subscribe(data => { this.inputs = data; },
       err =>  {
         return err;
        });
  }
  onStartServerClick() {
    this.action.startSeleniumServer().subscribe(data => { this.inputs = data; },
       err =>  {
         return err;
        });
  }
  onStartAutomationClick() {
    this.action.startSequentialExecution().subscribe(data => { this.inputs = data; },
       err =>  {
         return err;
        });
  }
  fetchReportStatus() {
    this.inputs.array.forEach(file => {
      this.resultService.getReportStatus(file).subscribe(data => {
        // this.reportStatus.push(data);
        console.log('data recieved is: ' + data);
      });
    });
  }

  ngOnInit() {
    this.getInputsArray();
    this.fetchReportStatus();
  }

}
