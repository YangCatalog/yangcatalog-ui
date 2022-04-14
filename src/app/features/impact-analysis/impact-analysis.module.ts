import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbAlertModule, NgbNavModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ClusteringService, PtTopologyService } from '@pt/pt-topology';
import { TagInputModule } from 'ngx-chips';
import { CoreModule } from '../../core/core.module';
import { AppAgGridModule } from '../../shared/ag-grid/app-ag-grid.module';
import { ImpactAnalysisRoutingModule } from './impact-analysis-routing.module';
import { ClusterContextMenuComponent } from './impact-analysis-visualisation/cluster-context-menu/cluster-context-menu.component';
import { ImpactAnalysisVisualisationComponent } from './impact-analysis-visualisation/impact-analysis-visualisation.component';
import { ImpactNodesListComponent } from './impact-analysis-visualisation/impact-nodes-list/impact-nodes-list.component';
import { ImpactWarningsComponent } from './impact-analysis-visualisation/impact-warnings/impact-warnings.component';
import { NodeContextMenuComponent } from './impact-analysis-visualisation/node-context-menu/node-context-menu.component';
import { ImpactAnalysisComponent } from './impact-analysis.component';


@NgModule({
  declarations: [ImpactAnalysisComponent, ImpactAnalysisVisualisationComponent, NodeContextMenuComponent, ClusterContextMenuComponent, ImpactNodesListComponent, ImpactWarningsComponent],
  entryComponents: [ImpactNodesListComponent, ImpactWarningsComponent],
  providers: [PtTopologyService, ClusteringService],
  imports: [
    CommonModule,
    ImpactAnalysisRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbNavModule,
    TagInputModule,
    NgbTypeaheadModule,
    RouterModule,
    CoreModule,
    AppAgGridModule
  ]
})
export class ImpactAnalysisModule { }
