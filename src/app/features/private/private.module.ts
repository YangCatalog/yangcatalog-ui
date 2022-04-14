import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PieChartModule } from '@swimlane/ngx-charts';
import { LightboxModule } from 'ngx-lightbox';
import { CoreModule } from '../../core/core.module';
import { AppAgGridModule } from '../../shared/ag-grid/app-ag-grid.module';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';


@NgModule({
  declarations: [PrivateComponent],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    NgbNavModule,
    LightboxModule,
    AppAgGridModule,
    RouterModule,
    FormsModule,
    PieChartModule,
    NgbAlertModule,
    CoreModule
  ]
})
export class PrivateModule { }
