import { Location } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClusteringService, TopologyData } from '@pt/pt-topology';
import { combineLatest, from, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, mergeMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ImpactAnalysisVisualisationComponent } from './impact-analysis-visualisation/impact-analysis-visualisation.component';
import { ImpactNodesListComponent } from './impact-analysis-visualisation/impact-nodes-list/impact-nodes-list.component';
import { ImpactWarningsComponent } from './impact-analysis-visualisation/impact-warnings/impact-warnings.component';
import { ImpactAnalysisModel } from './impact-analysis-visualisation/models/impact-analysis-model';
import { ImpactVisLinkModel } from './impact-analysis-visualisation/models/impact-vis-link-model';
import { ImpactVisNodeModel } from './impact-analysis-visualisation/models/impact-vis-node-model';
import { SvgIconService } from './impact-analysis-visualisation/svg-icon.service';
import { ImpactAnalysisService } from './impact-analysis.service';

@Component({
  selector: 'yc-impact-analysis',
  templateUrl: './impact-analysis.component.html',
  styleUrls: ['./impact-analysis.component.scss']
})
export class ImpactAnalysisComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('visComponent') visComponent: ImpactAnalysisVisualisationComponent;

  form: FormGroup;
  error: any;
  autocomplete = this.autocompleteRequest.bind(this);
  tagAutocomplete = this.tagAutocompleteRequest.bind(this);
  loadingResults = false;

  errors = [];
  warnings = [];


  highlightedOrg = '';
  highlightedMat = '';
  highlightedDir = '';

  colorsForOrgs = [
    'rgba(217,17,17,1)',
    'rgba(238,146,10,1)',
    'rgba(239,218,53,1)',
    'rgba(195,214,16,1)',
    'rgba(113,210,46,1)',
    'rgba(18,217,144,1)',
    'rgba(19,188,210,1)',
    'rgba(19,44,210,1)',
    'rgba(203,19,222,1)',
    'rgba(217,9,96,1)',
    'rgba(231,14,14,1)',
    'rgba(214,214,214,1)',
  ];

  colorForMats = [
    'rgba(100,32,32,1)', 'rgba(34,83,22,1)', 'rgba(37,90,110,1)', 'rgba(105,23,96,1)'
  ];


  visData: TopologyData;

  organizations: string[] = [];
  orgColors = {};
  orgSelected = {};

  maturities: string[] = [];
  matSelected = {};
  matColors = {};

  directions: string[] = ['dependencies', 'dependents'];
  dirSelected = { dependencies: true, dependents: true };

  params = {};
  queryParams = {
    rfcs: 1,
    show_subm: 1,
    show_dir: 'both'
  };

  myBaseUrl = environment.WEBROOT_BASE_URL;

  private componentDestroyed: Subject<void> = new Subject<void>();
  visOptions = {

    autoResize: true,
    height: '100%',
    width: '100%',
    physics: {
      enabled: false,
    },
    edges: {
      shadow: false,
      smooth: false,
    },
    layout: {
      hierarchical: {
        enabled: false
      }
    },
    nodes: {
      size: 30
    },
    interaction: {
      multiselect: true,
    }
  };
  mainResults: ImpactAnalysisModel[] = [];
  mainResultsNames: string[] = [];
  contextMenuTop: number = null;
  contextMenuLeft: number = null;
  selectedNode: ImpactAnalysisModel;
  clusterByOrganization = false;
  clusterByMaturity = false;
  selectedCluster: any;
  showWarnings = true;


  constructor(
    private fb: FormBuilder,
    private dataService: ImpactAnalysisService,
    private svgService: SvgIconService,
    private clusteringService: ClusteringService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location) {
  }

  ngOnInit(): void {
    this.initForm();

    combineLatest([this.route.params, this.route.queryParams])
      .pipe(map(results => ({ params: results[0], query: results[1] })))
      .subscribe(results => {
        const queryParamsProperties = ['rfcs', 'show_subm', 'show_dir', 'orgtags', 'modtags'];
        queryParamsProperties.forEach(prop => {
          if (results.query.hasOwnProperty(prop)) {
            this.queryParams[prop] = results.query[prop];
          }
        });

        if (results.params.hasOwnProperty('module')) {
          if (this.queryParams['modtags']) {
            this.queryParams['modtags'] += ',' + results.params['module'];
          } else {
            this.queryParams['modtags'] = results.params['module'];
          }
        }

        // Move modules from old php URL format to modtags query param
        if (results.query.hasOwnProperty('modules[]')) {
          const queryModules = Array.isArray(results.query['modules[]']) ? results.query['modules[]'].join(',') : results.query['modules[]'];
          if (this.queryParams['modtags']) {
            this.queryParams['modtags'] += ',' + queryModules;
          } else {
            this.queryParams['modtags'] = queryModules;
          }
        }

        if (this.queryParams['modtags']) {
          const queryModules = this.queryParams['modtags'].split(',');
          const moduleTags = queryModules.map(module => (
            { display: module.split('.yang')[0], value: module.split('.yang')[0] }
          ));
          this.form.get('moduleNamesList').setValue(moduleTags);
          this.submitModuleName(true);
        }
      });
  }

  private initForm() {
    this.form = this.fb.group({
      moduleName: [''],
      allowRfc: [true],
      allowSubmodules: [true],
      moduleNamesList: []
    });
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }

  ngAfterViewInit(): void {
  }


  onCloseError(i: number) {
    this.errors.splice(i, 1);
  }

  autocompleteRequest(text$: Observable<string>) {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      mergeMap(term => {
        if (term.length > 2) {
          return this.dataService.getModuleAutocomplete(term.toLowerCase());
        } else {
          return of([]);
        }
      }
      ),
      takeUntil(this.componentDestroyed)
    );
  }

  tagAutocompleteRequest(text$: string) {
    return this.dataService.getModuleAutocomplete(text$.toLowerCase());
  }

  addOrganizations(organizations: string[]): void {
    organizations.forEach(org => {
      if (this.organizations.indexOf(org) === -1) {
        this.organizations.push(org);
        this.orgColors[org] = this.colorsForOrgs[this.organizations.length - 1];
        this.orgSelected[org] = true;
      }
    });
  }

  addMaturities(maturities: string[]): void {
    maturities.forEach(mat => {
      if (this.maturities.indexOf(mat) === -1) {
        this.maturities.push(mat);
        this.matColors[mat] = this.colorForMats[this.maturities.length - 1];
        this.matSelected[mat] = true;
      }
    });
  }

  submitModuleName(fromURL = false) {
    let allModules = [];
    if (this.form.get('moduleNamesList').value) {
      allModules = this.form.get('moduleNamesList').value.map(module => module.value.split('@'));
    }

    this.showWarnings = true;
    this.mainResults = [];
    this.mainResultsNames = [];
    this.errors = [];
    this.warnings = [];
    this.visData = null;
    this.loadingResults = true;
    this.selectedNode = null;
    this.organizations = [];
    this.orgColors = {};
    this.maturities = [];
    this.matColors = {};

    this.visData = new TopologyData();

    from(allModules).pipe(
      mergeMap((module: string[]) => {
        return this.dataService.getImpactAnalysis(
          module[0],
          this.form.get('allowRfc').value,
          this.form.get('allowSubmodules').value,
          module.length > 1 ? module[1] : null
        );
      }),
      finalize(() => {
        if (fromURL) {
          this.updateTopologyByQueryParams();
        }
        else {
          this.updateURL();
        }
        this.loadingResults = false;
        this.visComponent.redraw();
      }),
      takeUntil(this.componentDestroyed)
    ).subscribe(impactResult => {
      this.mainResults.push(impactResult);
      this.mainResultsNames.push(impactResult.name);
      this.addOrganizations(impactResult.getOrganisations());
      this.addMaturities(impactResult.getMaturities());

      const newNodes = [];
      const newLinks = [];

      // if (!this.visData.getNodeById(impactResult.name)) {
      const newNode = new ImpactVisNodeModel(impactResult.name, impactResult.name, impactResult.organization, impactResult.maturity, this.orgColors[impactResult.organization], this.matColors[impactResult.maturity], false, false);
      this.visData.nodes.push();
      newNodes.push(newNode);
      // }

      impactResult['dependents'].forEach(dep => {
        if (dep['name']) {
          if (!this.visData.getNodeById(dep['name'])) {
            const newNode = new ImpactVisNodeModel(dep['name'], dep['name'], dep.organization, dep.maturity, this.orgColors[dep.organization], this.matColors[dep.maturity], false, true);
            this.visData.nodes.push(newNode);
            newNodes.push(newNode);
          }

          const newLink = new ImpactVisLinkModel(dep['name'] + '_' + impactResult.name, dep['name'], impactResult['name'], 'rgba(0,0,0,1)', 'from');
          this.visData.links.push(newLink);
          newLinks.push(newLink);
        }
      });

      impactResult['dependencies'].forEach(dep => {
        if (dep['name']) {
          if (!this.visData.getNodeById(dep['name'])) {
            const newNode = new ImpactVisNodeModel(dep['name'], dep['name'], dep.organization, dep.maturity, this.orgColors[dep.organization], this.matColors[dep.maturity], true, false);
            this.visData.nodes.push(newNode);
            newNodes.push(newNode);
          }

          const newLink = new ImpactVisLinkModel(impactResult.name + '_' + dep['name'], impactResult['name'], dep['name'], 'rgba(0,0,0,1)', 'from');
          this.visData.links.push(newLink);
          newLinks.push(newLink);
        }
      });

      this.visComponent.updateNodes(newNodes);
      this.visComponent.updateLinks(newLinks);

      this.warnings.push(...impactResult.warnings);
    },
      err => {
        console.error(err);
        this.errors.push(err);
      }
    );
  }

  onOrgMouseMove(org: string) {

    if (this.orgSelected[org] && org !== this.highlightedOrg) {
      this.highlightedOrg = org;

      const nodesToHighlighted = this.visData.nodes.filter((node) => {
        return node['organization'] === org || this.mainResults.findIndex(res => res.name === node['label']) !== -1;
      });

      this.visComponent.highlightNodes(nodesToHighlighted, this.orgColors, this.matColors);
    }

  }

  onMatMouseMove(mat: string) {

    if (this.matSelected[mat] && mat !== this.highlightedMat) {
      this.highlightedMat = mat;

      const nodesToHighlighted = this.visData.nodes.filter((node) => {
        return node['maturity'] === mat || this.mainResults.findIndex(res => res.name === node['label']) !== -1;
      });

      this.visComponent.highlightNodes(nodesToHighlighted, this.orgColors, this.matColors);
    }

  }

  onDirMouseMove(dir: string) {

    if (this.dirSelected[dir] && dir !== this.highlightedDir) {
      this.highlightedDir = dir;

      const nodesToHighlighted = this.visData.nodes.filter((node) => {
        return (dir === 'dependencies' && node['isDependency'])
          || (dir === 'dependents' && node['isDependent'])
          || this.mainResults.findIndex(res => res.name === node['label']) !== -1;
      });
      this.visComponent.highlightNodes(nodesToHighlighted, this.orgColors, this.matColors);
    }

  }

  onOrgMouseOut() {
    if (this.highlightedOrg) {
      this.visComponent.undimAllNodes(this.orgColors, this.matColors);
      this.highlightedOrg = '';
    }
  }

  onMatMouseOut() {
    if (this.highlightedMat) {
      this.visComponent.undimAllNodes(this.orgColors, this.matColors);
      this.highlightedMat = '';
    }
  }

  onDirMouseOut() {
    if (this.highlightedDir) {
      this.visComponent.undimAllNodes(this.orgColors, this.matColors);
      this.highlightedDir = '';
    }
  }

  onOrgToggle(checked: boolean, organization: string) {
    this.orgSelected[organization] = checked;
    const nodes = this.visData.nodes.filter(
      node => node['organization'] === organization && this.mainResults.findIndex(res => res.name === node['label']) === -1);
    nodes.forEach(node => node['hidden'] = !checked);
    this.visComponent.updateNodes(nodes);
    if (checked) {
      this.onOrgMouseMove(organization);
    } else {
      this.onOrgMouseOut();
    }
    this.updateURL();
  }

  onMatToggle(checked: boolean, mat: string) {
    this.matSelected[mat] = checked;
    const nodes = this.visData.nodes.filter(
      node => node['maturity'] === mat && this.mainResults.findIndex(res => res.name === node['label']) === -1);
    nodes.forEach(node => node['hidden'] = !checked);
    this.visComponent.updateNodes(nodes);
    if (checked) {
      this.onMatMouseMove(mat);
    } else {
      this.onMatMouseOut();
    }
  }

  onDirToggle(checked: boolean, dir: string) {
    this.dirSelected[dir] = checked;
    const nodes = this.visData.nodes.filter(node =>
      ((dir === 'dependencies' && node['isDependency']) || (dir === 'dependents' && node['isDependent']))
      && this.mainResults.findIndex(res => res.name === node['label']) === -1);
    nodes.forEach(node => node['hidden'] = !checked);
    this.visComponent.updateNodes(nodes);
    if (checked) {
      this.onDirMouseMove(dir);
    } else {
      this.onDirMouseOut();
    }
    this.updateURL();
  }

  onClusterOrganizationsToggle(clustered: boolean) {
    if (clustered) {
      if (this.clusterByMaturity) {
        this.clusterByMaturity = false;
        this.onClusterMaturityToggle(false);
      }
      this.organizations.forEach((organization: string) => {
        let organizationNodes: ImpactAnalysisModel[] = [];

        this.mainResults.forEach((res: ImpactAnalysisModel) => {
          const orgMembers = res.getOrganizationMembers(organization);
          const orgMembersNoMains = orgMembers.filter(orgMember => this.mainResults.findIndex(mainRes => mainRes.name === orgMember.name) === -1);
          const uniqueOrgMembers = orgMembersNoMains.filter(org => organizationNodes.findIndex(node => node.name === org.name) === -1);
          organizationNodes.push(...uniqueOrgMembers);
        });

        let membersCount = organizationNodes.length;
        const clusterOptionsByData = {
          joinCondition: (childOptions) => {
            return childOptions['organization'] === organization && this.mainResults.findIndex(res => res.name === childOptions['label']) === -1;
          },
          releaseFunction: () => {
            return {};
          },
          processProperties: (clusterOptions, childNodes, childEdges) => {
            let totalMass = 0;
            childNodes.forEach(childNode => totalMass += childNode.mass);
            clusterOptions.mass = totalMass;
            return clusterOptions;
          },
          clusterNodeProperties: {
            id: 'cluster_org_' + organization,
            borderWidth: 3,
            shape: 'dot',
            color: this.orgColors[organization],
            size: 15 + Math.round(membersCount * 0.75),
            label: `${organization} (${membersCount})`,
          },
        };
        this.visComponent.cluster(clusterOptionsByData);
        this.visComponent.redraw();
      });

      this.organizations.forEach(org => {
        if (!this.orgSelected[org]) {
          this.onOrgToggle(true, org);
        }
      });
      this.maturities.forEach(mat => {
        if (!this.matSelected[mat]) {
          this.onMatToggle(true, mat);
        }
      });
      this.directions.forEach(dir => {
        if (!this.dirSelected[dir]) {
          this.onMatToggle(true, dir);
        }
      });
      this.onOrgMouseOut();

    } else {
      this.organizations.forEach((organization: string) => {
        let organizationNodes: ImpactAnalysisModel[] = [];

        this.mainResults.forEach((res: ImpactAnalysisModel) => {
          const orgMembers = res.getOrganizationMembers(organization);
          const orgMembersNoMains = orgMembers.filter(orgMember => this.mainResults.findIndex(mainRes => mainRes.name === orgMember.name) === -1);
          const uniqueOrgMembers = orgMembersNoMains.filter(org => organizationNodes.findIndex(node => node.name === org.name) === -1);
          organizationNodes.push(...uniqueOrgMembers);
        });

        if (organizationNodes.length > 1) {
          this.visComponent.openCluster('cluster_org_' + organization);
        }
      });
    }

  }

  onClusterMaturityToggle(clustered: boolean) {
    if (clustered) {
      if (this.clusterByOrganization) {
        this.clusterByOrganization = false;
        this.onClusterOrganizationsToggle(false);
      }
      this.maturities.forEach((maturity: string) => {
        let maturityNodes: ImpactAnalysisModel[] = [];

        this.mainResults.forEach((res: ImpactAnalysisModel) => {
          const matMembers = res.getMaturityMembers(maturity);
          const matMembersNoMains = matMembers.filter(matMember => this.mainResults.findIndex(mainRes => mainRes.name === matMember.name) === -1);
          const uniqueMatMembers = matMembersNoMains.filter(mat => maturityNodes.findIndex(node => node.name === mat.name) === -1);
          maturityNodes.push(...uniqueMatMembers);
        });
        let membersCount = maturityNodes.length;
        const clusterOptionsByData = {
          joinCondition: (childOptions) => {
            return childOptions['maturity'] === maturity && this.mainResults.findIndex(res => res.name === childOptions['label']) === -1;
          },
          releaseFunction: () => {
            return {};
          },
          processProperties: (clusterOptions, childNodes, childEdges) => {
            let totalMass = 0;
            childNodes.forEach(childNode => totalMass += childNode.mass);
            clusterOptions.mass = totalMass;
            return clusterOptions;
          },
          clusterNodeProperties: {
            id: 'cluster_mat_' + maturity,
            borderWidth: 3,
            shape: 'dot',
            color: this.matColors[maturity],
            size: 15 + Math.round(membersCount * 0.75),
            label: `${maturity} (${membersCount})`,
          },
        };
        this.visComponent.cluster(clusterOptionsByData);
        this.visComponent.redraw();
      });

      this.organizations.forEach(org => {
        if (!this.orgSelected[org]) {
          this.onOrgToggle(true, org);
        }
      });
      this.maturities.forEach(mat => {
        if (!this.matSelected[mat]) {
          this.onMatToggle(true, mat);
        }
      });
      this.directions.forEach(dir => {
        if (!this.dirSelected[dir]) {
          this.onMatToggle(true, dir);
        }
      });
      this.onMatMouseOut();

    } else {
      this.maturities.forEach((maturity: string) => {
        let maturityNodes: ImpactAnalysisModel[] = [];

        this.mainResults.forEach((res: ImpactAnalysisModel) => {
          const matMembers = res.getMaturityMembers(maturity);
          const matMembersNoMains = matMembers.filter(matMember => this.mainResults.findIndex(mainRes => mainRes.name === matMember.name) === -1);
          const uniqueMatMembers = matMembersNoMains.filter(mat => maturityNodes.findIndex(node => node.name === mat.name) === -1);
          maturityNodes.push(...uniqueMatMembers);
        });

        if (maturityNodes.length > 1) {
          this.visComponent.openCluster('cluster_mat_' + maturity);
        }
      });
    }

  }

  onClickNode(event) {
    this.selectedCluster = null;
    this.selectedNode = null;
    this.contextMenuTop = event['pointer']['DOM']['y'];
    this.contextMenuLeft = event['pointer']['DOM']['x'];
    const clickedNodeId = event['nodes'][event['nodes'].length - 1];
    if (clickedNodeId.indexOf('cluster_') !== -1) {
      this.selectedCluster = clickedNodeId;
    } else {
      this.selectedNode = this.mainResults.find(res => res.getNodeByName(clickedNodeId)).getNodeByName(clickedNodeId);
    }
  }

  onClickCanvas() {
    this.contextMenuLeft = null;
    this.contextMenuTop = null;
    this.selectedNode = null;
    this.selectedCluster = null;
  }

  onLoadMore() {
    this.dataService.getImpactAnalysis(
      this.selectedNode.name,
      this.form.get('allowRfc').value,
      this.form.get('allowSubmodules').value,
      this.selectedNode.revision
    ).pipe(
      finalize(() => this.loadingResults = false),
      takeUntil(this.componentDestroyed)
    ).subscribe(
      impactResult => {

        this.addOrganizations(impactResult.getOrganisations());
        this.addMaturities(impactResult.getMaturities());


        const newNodes = [];
        const newLinks = [];

        impactResult['dependents'].forEach(dep => {
          if (dep['name']) {
            const newNode = new ImpactVisNodeModel(dep['name'], dep['name'], dep.organization, dep.maturity, this.orgColors[dep.organization], this.matColors[dep.maturity], false, true);
            this.visData.nodes.push(newNode);
            newNodes.push(newNode);

            const newLink = new ImpactVisLinkModel(dep['name'] + '_' + impactResult.name, dep['name'], impactResult['name'], 'rgba(0,0,0,1)', 'from');
            this.visData.links.push(newLink);
            newLinks.push(newLink);
          }
        });

        impactResult['dependencies'].forEach(dep => {
          if (dep['name']) {
            const newNode = new ImpactVisNodeModel(dep['name'], dep['name'], dep.organization, dep.maturity, this.orgColors[dep.organization], this.matColors[dep.maturity], true, false);
            this.visData.nodes.push(newNode);
            newNodes.push(newNode);

            const newLink = new ImpactVisLinkModel(impactResult.name + '_' + dep['name'], impactResult['name'], dep['name'], 'rgba(0,0,0,1)', 'from');
            this.visData.links.push(newLink);
            newLinks.push(newLink);
          }
        });
        this.visComponent.updateNodes(newNodes);
        this.visComponent.updateLinks(newLinks);

        this.selectedNode = null;

      },
      err => {
        console.error(err);
        this.selectedNode = null;
        this.errors.push(err);
      }
    );

  }

  rearrange() {
    this.visComponent.redraw();
  }

  onShowClusterNodesList(selectedClusterId: string) {
    const modalNodeDetail: ImpactNodesListComponent = this.modalService.open(ImpactNodesListComponent, {
      size: 'lg',
    }).componentInstance;

    if (selectedClusterId.indexOf('_org_') !== -1) {
      let organizationNodes: ImpactAnalysisModel[] = [];

      this.mainResults.forEach((res: ImpactAnalysisModel) => {
        const orgMembers = res.getOrganizationMembers(selectedClusterId.replace('cluster_org_', ''));
        const orgMembersNoMains = orgMembers.filter(orgMember => this.mainResults.findIndex(mainRes => mainRes.name === orgMember.name) === -1);
        const uniqueOrgMembers = orgMembersNoMains.filter(org => organizationNodes.findIndex(node => node.name === org.name) === -1);
        organizationNodes.push(...uniqueOrgMembers);
      });

      modalNodeDetail.nodesList = organizationNodes;
    } else {
      let maturityNodes: ImpactAnalysisModel[] = [];

      this.mainResults.forEach((res: ImpactAnalysisModel) => {
        const matMembers = res.getMaturityMembers(selectedClusterId.replace('cluster_mat_', ''));
        const matMembersNoMains = matMembers.filter(matMember => this.mainResults.findIndex(mainRes => mainRes.name === matMember.name) === -1);
        const uniqueMatMembers = matMembersNoMains.filter(mat => maturityNodes.findIndex(node => node.name === mat.name) === -1);
        maturityNodes.push(...uniqueMatMembers);
      });

      modalNodeDetail.nodesList = maturityNodes;
    }

    this.selectedCluster = null;
  }

  onToolbarClick() {
    this.selectedNode = null;
    this.selectedCluster = null;
  }

  onShowWarningsClick() {
    const warningsComp: ImpactWarningsComponent = this.modalService.open(ImpactWarningsComponent, {
      size: 'lg',
    }).componentInstance;

    warningsComp.warnings = this.warnings;
  }

  onCloseWarnings() {
    this.showWarnings = false;
  }

  updateURL() {
    this.updateQueryParams();
    const url = this.router.createUrlTree(
      ['yang-search', 'impact_analysis'],
      {
        queryParams: this.queryParams
      }).toString();

    this.location.go(url);
  }

  updateQueryParams() {
    this.queryParams['rfcs'] = this.form.get('allowRfc').value ? 1 : 0;
    this.queryParams['show_subm'] = this.form.get('allowSubmodules').value ? 1 : 0;

    if ((this.dirSelected['dependencies'] === true && this.dirSelected['dependents'] === true) ||
      (this.dirSelected['dependencies'] === false && this.dirSelected['dependents'] === false)) {
      this.queryParams['show_dir'] = 'both';
    } else if (this.dirSelected['dependencies']) {
      this.queryParams['show_dir'] = 'dependencies';
    } else if (this.dirSelected['dependents']) {
      this.queryParams['show_dir'] = 'dependents';
    }

    const queryOrganizations = [];
    for (const org in this.orgSelected) {
      if (this.orgSelected[org]) {
        queryOrganizations.push(org);
      }
    }
    this.queryParams['orgtags'] = queryOrganizations.length > 0 ? queryOrganizations.join(',') : null;

    const queryModules = this.form.get('moduleNamesList').value.map(module => module.value + '.yang');
    this.queryParams['modtags'] = queryModules.length > 0 ? queryModules.join(',') : null;
  }

  updateTopologyByQueryParams() {
    this.form.get('allowRfc').setValue(this.queryParams['rfcs'] == 0 ? false : true);
    this.form.get('allowSubmodules').setValue(this.queryParams['show_subm'] == 0 ? false : true);

    switch (this.queryParams['show_dir']) {
      case 'dependencies':
        this.onDirToggle(false, 'dependents');
        break;
      case 'dependents':
        this.onDirToggle(false, 'dependencies');
        break;
      default:
        this.dirSelected = { dependencies: true, dependents: true };
        break;
    }

    if (this.queryParams['orgtags']) {
      const queryOrganizations = this.queryParams['orgtags'].split(',');
      const uncheckedOrgs = this.organizations.filter(org => !queryOrganizations.includes(org));
      for (const org in this.orgSelected) {
        if (uncheckedOrgs.includes(org)) {
          this.onOrgToggle(false, org);
        }
      }
    }
  }
}
