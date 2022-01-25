import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbAccordionModule, NgbAlertModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { CoreModule } from '../../core/core.module';
import { FileUploadFormModule } from '../../shared/file-upload-form/file-upload-form.module';
import { ApiOverviewComponent } from './api-overview/api-overview.component';
import { MissingModulesSelectionComponent } from './missing-modules-confirmation/missing-modules-selection.component';
import { ValidationErrorComponent } from './validation-error/validation-error.component';
import { ValidationResultComponent } from './validation-result/validation-result.component';
import { YangValidatorComponent } from './yang-validator.component';
import { YangValidatorService } from './yang-validator.service';

@NgModule({
  declarations: [YangValidatorComponent, MissingModulesSelectionComponent, ValidationResultComponent, ValidationErrorComponent, ApiOverviewComponent],
  providers: [
    YangValidatorService
  ],
    imports: [
        CommonModule,
        NgbTabsetModule,
        ReactiveFormsModule,
        FormsModule,
        NgBootstrapFormValidationModule,
        NgbAccordionModule,
        NgbAlertModule,
        FileUploadFormModule,
        RouterModule,
        CoreModule
    ]
})
export class YangValidatorModule {
}
