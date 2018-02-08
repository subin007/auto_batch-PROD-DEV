import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ResultService } from './services/result.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ResultService]

})
export class AppComponent implements OnInit {
  metadata;
  public constructor(private titleService: Title, private resultService: ResultService) { }

  public setTitle(newTitle: any) {
    this.titleService.setTitle(newTitle);
  }

  ngOnInit() {
    // this.setTitle('');
    this.resultService.getMegaThrowReport().subscribe(data => {
      this.metadata = data.metadata;
      this.setTitle(new Date(this.metadata.startedAt).toUTCString());
    });
  }
}
