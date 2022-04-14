import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgxCaptchaModule } from 'ngx-captcha';
import { CoreModule } from 'src/app/core/core.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';


@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgBootstrapFormValidationModule,
    NgbAlertModule,
    NgxCaptchaModule,
    CoreModule
  ]
})
export class AccountModule { }
