import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbAlertModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { CoreModule } from '../../core/core.module';
import { YangModuleDetailsRoutingModule } from './yang-module-details-routing.module';
import { YangModuleDetailsComponent } from './yang-module-details.component';
import { YangPropertyHelpModalComponent } from './yang-property-help-modal/yang-property-help-modal.component';
import { YangImplementationsModalComponent } from './yang-implementations-modal/yang-implementations-modal.component';


@NgModule({
  declarations: [YangModuleDetailsComponent, YangPropertyHelpModalComponent, YangImplementationsModalComponent],
  imports: [
    CommonModule,
    YangModuleDetailsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbAlertModule,
    NgbTypeaheadModule,
    NgBootstrapFormValidationModule,
    NgbTooltipModule,
    RouterModule,
    CoreModule
  ]
})
export class YangModuleDetailsModule { }
