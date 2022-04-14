import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YangStatsComponent } from './yang-stats.component';

const routes: Routes = [
    {
        path: '',
        component: YangStatsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class YangStatsRoutingModule { }
