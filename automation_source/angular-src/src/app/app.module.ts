import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ResultService } from './services/result.service';
import { ReportComponent } from './components/report/report.component';
import { ReportDetailsComponent } from './components/report-details/report-details.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MasterComponent } from './components/master/master.component';
import { ActionService } from './services/action.service';
import { UnifiedModelComponent } from './components/unified-model/unified-model.component';

const routes: Routes = [
  { path: '', redirectTo: '/unified-model', pathMatch: 'full' },
  { path: 'unified-model', component: UnifiedModelComponent },
  { path: 'unified-model/report/:id', component: ReportComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    ReportComponent,
    ReportDetailsComponent,
    LoaderComponent,
    MasterComponent,
    UnifiedModelComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule.forRoot(routes)
  ],
  providers: [ResultService, Title, ActionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
