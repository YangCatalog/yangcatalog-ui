import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YangImplementationsComponent } from './yang-implementations.component';

const routes: Routes = [
    {
        path: '',
        component: YangImplementationsComponent
    },
    {
        path: ':path',
        component: YangImplementationsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class YangImplementationsRoutingModule { }
