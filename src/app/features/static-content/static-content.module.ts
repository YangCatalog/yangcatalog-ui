import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YangCatalogComponent } from './yang-catalog/yang-catalog.component';
import { AboutComponent } from './about/about.component';
import { ContributeComponent } from './contribute/contribute.component';
import { StaticContentComponent } from './static-content.component';
import { RouterModule } from '@angular/router';
import { StaticContentRoutingModule } from './static-content-routing.module';
import { CoreModule } from '../../core/core.module';
import { ContactComponent } from './contact/contact.component';
import { UseComponent } from './use/use.component';
import { QueryComponent } from './query/query.component';

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
