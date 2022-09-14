import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YangImplementationsRoutingModule } from './yang-implementations-routing.module';
import { YangImplementationsComponent } from './yang-implementations.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [YangImplementationsComponent],
  imports: [
    CommonModule,
    YangImplementationsRoutingModule,
    NgbAlertModule
  ]
})
export class YangImplementationsModule { }
