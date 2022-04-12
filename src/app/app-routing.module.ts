import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './features/account/account/account.component';
import { ImpactAnalysisComponent } from './features/impact-analysis/impact-analysis.component';
import { PrivateComponent } from './features/private/private.component';
import { YangCatalogComponent } from './features/static-content/yang-catalog/yang-catalog.component';
import { YangStatsComponent } from './features/statistics/yang-stats.component';
import { YangModuleDetailsComponent } from './features/yang-module-details/yang-module-details.component';
import { YangRegexValidatorComponent } from './features/yang-regex-validator/yang-regex-validator.component';
import { YangSearchComponent } from './features/yang-search/yang-search.component';
import { YangShowNodeComponent } from './features/yang-show-node/yang-show-node.component';
import { YangTreeComponent } from './features/yang-tree/yang-tree.component';
import { YangValidatorComponent } from './features/yang-validator/yang-validator.component';

// todo: move child routes to child modules
const routes: Routes = [
  {
    path: '',
    component: YangCatalogComponent
  },
  {
    path: 'private-page',
    component: PrivateComponent,
    data: { title: 'YANG Modules Stats' }
  },
  {
    path: 'private-page/:jsonfile',
    component: PrivateComponent,
    data: { title: 'YANG Modules Stats' }
  },
  {
    path: 'yangvalidator/:validating',
    component: YangValidatorComponent,
    data: { title: 'YANG Validator' }
  },
  {
    path: 'yangvalidator',
    component: YangValidatorComponent,
    data: { title: 'YANG Validator' }
  },
  {
    path: 'yang-search/show_node/:node/:path/:revision',
    component: YangShowNodeComponent
  },
  {
    path: 'yang-search',
    component: YangSearchComponent,
    data: { title: 'YANG Search' }
  },
  {
    path: 'yang-search/module_details',
    component: YangModuleDetailsComponent,
    data: { title: 'YANG Module Details' }
  },
  {
    path: 'yang-search/module_details/:module',
    component: YangModuleDetailsComponent,
    data: { title: 'YANG Module Details' }
  },
  {
    path: 'yang-search/yang_tree/:module',
    component: YangTreeComponent,
    data: { title: 'YANG Tree' }
  },
  {
    path: 'yang-search/impact_analysis/:module',
    component: ImpactAnalysisComponent,
    data: { title: 'YANG Impact Analysis' }
  },
  {
    path: 'yang-search/impact_analysis',
    component: ImpactAnalysisComponent,
    data: { title: 'YANG Impact Analysis' }
  },
  {
    path: 'yangre',
    component: YangRegexValidatorComponent,
    data: { title: 'YANG Regex Validator' }
  },
  {
    path: 'stats/statistics.html',
    component: YangStatsComponent,
    data: { title: 'Statistics' }
  },
  {
    path: 'create.html',
    component: AccountComponent,
    data: { title: 'Create Account' }
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
