import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImpactAnalysisComponent } from './impact-analysis.component';


const routes: Routes = [
    {
        path: '',
        component: ImpactAnalysisComponent
    },
    {
        path: ':module',
        component: ImpactAnalysisComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ImpactAnalysisRoutingModule { }
