import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { YangShowNodeModalComponent } from './yang-show-node-modal/yang-show-node-modal.component';
import { YangShowNodeRoutingModule } from './yang-show-node-routing.module';
import { YangShowNodeComponent } from './yang-show-node.component';


@NgModule({
  declarations: [YangShowNodeComponent, YangShowNodeModalComponent],
  imports: [
    CommonModule,
    YangShowNodeRoutingModule,
    NgbAlertModule
  ]
})
export class YangShowNodeModule { }
