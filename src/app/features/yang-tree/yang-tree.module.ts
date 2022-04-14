import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { CoreModule } from '../../core/core.module';
import { AppAgGridModule } from '../../shared/ag-grid/app-ag-grid.module';
import { YangTreeRoutingModule } from './yang-tree-routing.module';
import { YangTreeComponent } from './yang-tree.component';


@NgModule({
  declarations: [YangTreeComponent],
  imports: [
    CommonModule,
    YangTreeRoutingModule,
    AppAgGridModule,
    FontAwesomeModule,
    CoreModule,
    ClipboardModule,
    NgbAlertModule
  ]
})
export class YangTreeModule { }
