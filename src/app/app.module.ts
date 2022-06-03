import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { StaticContentModule } from './features/static-content/static-content.module';
import { AppAgGridModule } from './shared/ag-grid/app-ag-grid.module';
import { TitleService } from './shared/title/title.service';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    StaticContentModule,
    HttpClientModule,
    NgBootstrapFormValidationModule.forRoot(),
    CoreModule,
    AppAgGridModule,
    FontAwesomeModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxMatomoTrackerModule.forRoot({
      siteId: environment.MATOMO_SITE_ID,
      trackerUrl: environment.MATOMO_TRACKER_URL,
      disabled: !environment.production // Remove this line to use Matomo on DEV environment
    }),
  ],
  providers: [TitleService],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
