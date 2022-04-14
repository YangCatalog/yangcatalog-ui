import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YangSearchComponent } from './yang-search.component';

const routes: Routes = [
    {
        path: '',
        component: YangSearchComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class YangSearchRoutingModule { }
