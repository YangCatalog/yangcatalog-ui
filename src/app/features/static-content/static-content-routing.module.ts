import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ContributeComponent } from './contribute/contribute.component';
import { QueryComponent } from './query/query.component';
import { UseComponent } from './use/use.component';
import { YangCatalogComponent } from './yang-catalog/yang-catalog.component';

const staticRoutes: Routes = [
  {
    path: '',
    component: YangCatalogComponent,
    pathMatch: 'full',
    data: { title: 'Home' }
  },
  {
    path: 'home.html',
    component: YangCatalogComponent,
    data: { title: 'Home' }
  },
  {
    path: 'contact.html',
    component: ContactComponent,
    data: { title: 'Contact' }
  },
  {
    path: 'use.html',
    component: UseComponent,
    data: { title: 'Use cases' }
  },
  {
    path: 'about.html',
    component: AboutComponent,
    data: { title: 'About' }
  },
  {
    path: 'contribute.html',
    component: ContributeComponent,
    data: { title: 'Contribute' }
  },
  {
    path: 'query.html',
    component: QueryComponent,
    data: { title: 'Query' }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(staticRoutes)

  ]
})
export class StaticContentRoutingModule {
}
