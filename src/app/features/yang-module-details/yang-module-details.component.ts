import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorMessage } from 'ng-bootstrap-form-validation';
import { merge, Observable, of, Subject, zip } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, mergeMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ModuleDetailsModel } from './models/module-details-model';
import { ModuleImplementationModel } from './models/module-implementation-model';
import { ModuleInfoMetaDataModel } from './models/module-info-meta-data-model';
import { YangImplementationsModalComponent } from './yang-implementations-modal/yang-implementations-modal.component';
import { YangModuleDetailsService } from './yang-module-details.service';
import { YangPropertyHelpModalComponent } from './yang-property-help-modal/yang-property-help-modal.component';

@Component({
  selector: 'yc-yang-module-details',
  templateUrl: './yang-module-details.component.html',
  styleUrls: ['./yang-module-details.component.scss']
})
export class YangModuleDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('revisionTemplate') public revisionTemplate: TemplateRef<any>;
  @ViewChild('plainTextTemplate') public plainTextTemplate: TemplateRef<any>;
  @ViewChild('linkTemplate') public linkTemplate: TemplateRef<any>;
  @ViewChild('ietfDataTemplate') public ietfDataTemplate: TemplateRef<any>;
  @ViewChild('mailTemplate') public mailTemplate: TemplateRef<any>;
  @ViewChild('formatedTextTemplate') public formatedTextTemplate: TemplateRef<any>;
  @ViewChild('nestedListOfObjectsTemplate') public nestedListOfObjectsTemplate: TemplateRef<any>;
  @ViewChild('deviationTemplate') public deviationTemplate: TemplateRef<any>;

  myBaseUrl = environment.WEBROOT_BASE_URL;

  form: FormGroup;
  loadingDetailsProgress = false;

  metaData: ModuleInfoMetaDataModel;
  infoData: ModuleDetailsModel;
  error: any;

  autocomplete = this.autocompleteRequest.bind(this);

  expanded = {};

  customPatternErrorMessages: ErrorMessage[] = [
    {
      error: 'required',
      format: (label, error) => `${label} is required`
    }, {
      error: 'nonexistingModule',
      format: (label, error) => `Module with this name doesn't exist`
    }
  ];

  private componentDestroyed: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dataService: YangModuleDetailsService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.subscribeRouteParams();
  }

  private subscribeRouteParams() {
    merge(this.route.params, this.route.queryParams).subscribe(
      params => {
        if (params.hasOwnProperty('module')) {
          const moduleNameArr = params['module'].split('@');
          this.form.get('moduleName').setValue(moduleNameArr[0]);
          this.form.get('moduleRevision').setValue(moduleNameArr[1]);
          this.loadModuleDetails();
        }
      }
    );

  }

  private initForm() {
    this.form = this.fb.group({
      moduleName: ['', Validators.required, this.getNonexistingValidator()],
      moduleRevision: ['']
    });
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
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

  onCloseError() {
    this.error = null;
  }

  loadModuleDetails() {
    if (this.form.invalid) {
      return;
    }

    let requestModuleName = this.form.get('moduleName').value.trim();
    if (this.form.get('moduleRevision').value) {
      requestModuleName += '@' + this.form.get('moduleRevision').value;
    }

    this.error = null;
    this.loadingDetailsProgress = true;
    this.infoData = null;
    this.metaData = null;

    zip(
      this.dataService.getModuleInfoHelp().pipe(takeUntil(this.componentDestroyed)),
      this.dataService.getModuleDetails(requestModuleName).pipe(takeUntil(this.componentDestroyed))
    ).pipe(
      finalize(() => this.loadingDetailsProgress = false)
    ).subscribe(
      ([meta, info]) => {
        this.metaData = meta;
        this.infoData = info;
        this.form.get('moduleRevision').setValue(this.infoData.data['revision']);
      },
      (err: HttpErrorResponse) => {
        this.error = err.error;
      }
    );
  }

  onGetDetailsClick() {
    const newRoute = this.myBaseUrl + '/yang-search/module_details/' + this.form.get('moduleName').value.trim();
    // this.router.navigate([newRoute]);
    window.location.href = newRoute;
  }

  onRevisionSelectChange(event: Event) {
    const newRoute = this.myBaseUrl + '/yang-search/module_details/' + this.form.get('moduleName').value.trim() + '@' + this.form.get('moduleRevision').value;
    // this.router.navigate([newRoute]);
    window.location.href = newRoute;
  }

  getPropTemplate(property: string, isNested = false): TemplateRef<any> {
    const templatesMapping = {
      revision: isNested ? 'plainTextTemplate' : 'revisionTemplate',
      'compilation-result': 'linkTemplate',
      schema: 'linkTemplate',
      reference: 'linkTemplate',
      'yang-tree': 'linkTemplate',
      'document-name': 'formatedTextTemplate',
      description: 'formatedTextTemplate',
      contact: 'formatedTextTemplate',
      ietf: 'ietfDataTemplate',
      submodule: 'nestedListOfObjectsTemplate',
      dependencies: 'nestedListOfObjectsTemplate',
      dependents: 'nestedListOfObjectsTemplate',
      'author-email': 'mailTemplate',
      implementations: 'nestedListOfObjectsTemplate',
      deviation: 'deviationTemplate'
    };

    if (templatesMapping.hasOwnProperty(property)) {
      return this[templatesMapping[property]];
    } else {
      return this.plainTextTemplate;
    }
  }

  expandCollapsableObject(key: string): void {
    this.expanded[key] = true;
  }

  collapseObject(key: string): void {
    this.expanded[key] = false;
  }

  getNonexistingValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.dataService.getModuleAutocomplete(control.value).pipe(
        map(result => {
          if (result.indexOf(control.value) === -1) {
            return { nonexistingModule: true };
          } else {
            return null;
          }
        })
      );
    };
  }

  openPropertyHelpModal(property: string[]) {
    const modalNodeDetail: YangPropertyHelpModalComponent = this.modalService.open(YangPropertyHelpModalComponent, {
      size: 'lg',
    }).componentInstance;
    modalNodeDetail.property = property.join(' >> ');
    modalNodeDetail.help = this.metaData.getPropertyHelpText(property);
  }

  openImplementationsHelpModal() {
    const modalImplemtations: YangImplementationsModalComponent = this.modalService.open(YangImplementationsModalComponent, {
      size: 'lg',
    }).componentInstance;
    modalImplemtations.name = this.infoData.data['name'];
    modalImplemtations.revision = this.infoData.data['revision'];
    modalImplemtations.metadata = this.metaData.getPropertiesSorted(this.metaData.metaData['implementations'])
    modalImplemtations.implementations = this.infoData.data['implementations'] ? this.infoData.data['implementations'] : [];
  }
}
