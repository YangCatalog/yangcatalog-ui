import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YangRegexValidatorComponent } from './yang-regex-validator.component';

const routes: Routes = [
    {
        path: '',
        component: YangRegexValidatorComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class YangRegexValidatorRoutingModule { }
