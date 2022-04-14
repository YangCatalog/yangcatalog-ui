import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YangTreeComponent } from './yang-tree.component';

const routes: Routes = [
    {
        path: '',
        component: YangTreeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class YangTreeRoutingModule { }
