import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YangValidatorComponent } from './yang-validator.component';

const routes: Routes = [
    {
        path: '',
        component: YangValidatorComponent
    },
    {
        path: ':validating',
        component: YangValidatorComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class YangValidatorRoutingModule { }
