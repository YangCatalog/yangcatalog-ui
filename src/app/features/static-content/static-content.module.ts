import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../../core/core.module';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ContributeComponent } from './contribute/contribute.component';
import { QueryComponent } from './query/query.component';
import { StaticContentRoutingModule } from './static-content-routing.module';
import { StaticContentComponent } from './static-content.component';
import { UseComponent } from './use/use.component';
import { YangCatalogComponent } from './yang-catalog/yang-catalog.component';

@NgModule({
  declarations: [YangCatalogComponent, AboutComponent, ContributeComponent, StaticContentComponent, ContactComponent, UseComponent, QueryComponent],
  imports: [
    CommonModule,
    RouterModule,
    StaticContentRoutingModule,
    CoreModule
  ]
})
export class StaticContentModule { }
