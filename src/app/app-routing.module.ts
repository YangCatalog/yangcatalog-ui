import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YangCatalogComponent } from './features/static-content/yang-catalog/yang-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: YangCatalogComponent
  },
  {
    path: 'private-page',
    loadChildren: () => import('./features/private/private.module').then(mod => mod.PrivateModule),
    data: { title: 'YANG Modules Stats' }
  },
  {
    path: 'yangvalidator',
    loadChildren: () => import('./features/yang-validator/yang-validator.module').then(mod => mod.YangValidatorModule),
    data: { title: 'YANG Validator' }
  },
  {
    path: 'yang-search/show_node/:node/:path/:revision',
    loadChildren: () => import('./features/yang-show-node/yang-show-node.module').then(mod => mod.YangShowNodeModule)
  },
  {
    path: 'yang-search',
    loadChildren: () => import('./features/yang-search/yang-search.module').then(mod => mod.YangSearchModule),
    data: { title: 'YANG Search' }
  },
  {
    path: 'yang-search/module_details',
    loadChildren: () => import('./features/yang-module-details/yang-module-details.module').then(mod => mod.YangModuleDetailsModule),
    data: { title: 'YANG Module Details' }
  },
  {
    path: 'yang-search/yang_tree/:module',
    loadChildren: () => import('./features/yang-tree/yang-tree.module').then(mod => mod.YangTreeModule),
    data: { title: 'YANG Tree' }
  },
  {
    path: 'yang-search/implementations',
    loadChildren: () => import('./features/yang-implementations/yang-implementations.module').then(mod => mod.YangImplementationsModule),
    data: { title: 'YANG Module Implementations' }
  },
  {
    path: 'yang-search/impact_analysis',
    loadChildren: () => import('./features/impact-analysis/impact-analysis.module').then(mod => mod.ImpactAnalysisModule),
    data: { title: 'YANG Impact Analysis' }
  },
  {
    path: 'yangre',
    loadChildren: () => import('./features/yang-regex-validator/yang-regex-validator.module').then(mod => mod.YangRegexValidatorModule),
    data: { title: 'YANG Regex Validator' }
  },
  {
    path: 'stats/statistics.html',
    loadChildren: () => import('./features/statistics/yang-stats.module').then(mod => mod.YangStatsModule),
    data: { title: 'Statistics' }
  },
  {
    path: 'create.html',
    loadChildren: () => import('./features/account/account.module').then(mod => mod.AccountModule),
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
