import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { BarChartModule, PieChartModule } from '@swimlane/ngx-charts';
import { CoreModule } from '../../core/core.module';
import { AppAgGridModule } from '../../shared/ag-grid/app-ag-grid.module';
import { YangStatsRoutingModule } from './yang-stats-routing.module';
import { YangStatsComponent } from './yang-stats.component';


@NgModule({
  declarations: [YangStatsComponent],
  imports: [
    CommonModule,
    YangStatsRoutingModule,
    CoreModule,
    NgbNavModule,
    NgbAlertModule,
    BarChartModule,
    PieChartModule,
    AppAgGridModule,
    FormsModule,
    FontAwesomeModule
  ]
})
export class YangStatsModule { }
