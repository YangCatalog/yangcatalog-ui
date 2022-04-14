import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YangShowNodeComponent } from './yang-show-node.component';

const routes: Routes = [
    {
        path: '',
        component: YangShowNodeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class YangShowNodeRoutingModule { }
