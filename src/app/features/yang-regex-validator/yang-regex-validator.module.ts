import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { YangRegexAboutComponent } from './yang-regex-about/yang-regex-about.component';
import { YangRegexValidatorRoutingModule } from './yang-regex-validator-routing.module';
import { YangRegexValidatorComponent } from './yang-regex-validator.component';


@NgModule({
  declarations: [YangRegexValidatorComponent, YangRegexAboutComponent],
  imports: [
    CommonModule,
    YangRegexValidatorRoutingModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgBootstrapFormValidationModule,
    NgbAlertModule
  ]
})
export class YangRegexValidatorModule { }
