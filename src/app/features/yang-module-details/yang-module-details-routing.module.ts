import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YangModuleDetailsComponent } from './yang-module-details.component';

const routes: Routes = [
    {
        path: '',
        component: YangModuleDetailsComponent
    },
    {
        path: ':module',
        component: YangModuleDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class YangModuleDetailsRoutingModule { }
