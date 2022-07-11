import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ErrorMessage } from 'ng-bootstrap-form-validation';
import { merge, Subject } from 'rxjs';
import { finalize, mergeMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { YcValidationsService } from '../../core/yc-validations.service';
import { FileUploadFormComponent } from '../../shared/file-upload-form/file-upload-form.component';
import { MissingModulesSelectionComponent } from './missing-modules-confirmation/missing-modules-selection.component';
import { ChosenMissingRevsInput } from './models/chosen-missing-revs-input';
import { ValidationOutput } from './models/validation-output';
import { YangValidatorService } from './yang-validator.service';


@Component({
  selector: 'yc-yang-validator',
  templateUrl: './yang-validator.component.html',
  styleUrls: ['./yang-validator.component.scss']
})
export class YangValidatorComponent implements OnInit, OnDestroy {
  @ViewChild('filesForm') filesForm: FileUploadFormComponent;
  @ViewChild('draftFileForm') draftFileForm: FileUploadFormComponent;
  @ViewChild('validationResults') validationResults: ElementRef;

  myBaseUrl = environment.WEBROOT_BASE_URL;

  rfcNumberForm: FormGroup;
  draftNameForm: FormGroup;

  rfcNumberValidation = true;
  draftNameValidation = true;
  filesValidation = true;
  draftFileValidation = true;
  apiOverview = false;

  activeForm = '';

  validatingRfcNumberProgress = false;
  validatingDraftNameProgress = false;
  validatingFilesProgress = false;
  validatingDraftFileProgress = false;

  validationOutput: ValidationOutput;

  customErrorMessages: ErrorMessage[] = [
    {
      error: 'notNumber',
      format: (label, error) => `${label} has to be a number`
    }
  ];

  private componentDestroyed: Subject<void> = new Subject<void>();
  private formTypeChanged: Subject<void> = new Subject<void>();
  filesError = null;
  draftError = null;
  rfcError = null;
  draftNameError = null;
  versions = {};

  queryParams = {
    rfc: '',
    draft: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private dataService: YangValidatorService,
    private modalService: NgbModal,
    private ycValidations: YcValidationsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }


  ngOnInit() {
    this.initRfcNumberForm();

    this.initDraftNameForm();

    this.subscribeRouteParams();
    this.subscribeQueryParams();

    this.getVersions();
  }


  private initDraftNameForm() {
    this.draftNameForm = this.formBuilder.group({
      draftName: ['', Validators.required]
    });
  }

  private initRfcNumberForm() {
    this.rfcNumberForm = this.formBuilder.group({
      rfcNumber: ['', [Validators.required, this.ycValidations.getNumberValidation()]]
    });
  }

  private getVersions() {
    this.dataService.getValidatorsVersion().subscribe(versions => {
      this.versions = Object.keys(versions).reduce((acc, key) => {
        let new_key = key.split('-version')[0];
        acc[new_key] = versions[key].split(' ').pop();
        return acc;
      }, {});
    });
  }

  showRfcNumberForm() {
    this.formTypeChanged.next();
    this.rfcNumberValidation = true;
    this.initRfcNumberForm();
  }

  showFilesForm() {
    this.formTypeChanged.next();
    this.filesValidation = true;
  }

  showDraftFileForm() {
    this.formTypeChanged.next();
    this.draftFileValidation = true;
  }

  showDraftNameForm() {
    this.formTypeChanged.next();
    this.draftNameValidation = true;
    this.initDraftNameForm();
  }

  showApiOverview() {
    this.formTypeChanged.next();
    this.apiOverview = true;
  }

  noFormDisplayed() {
    return !(this.rfcNumberValidation || this.draftNameValidation || this.filesValidation || this.draftFileValidation || this.apiOverview);
  }

  resetValidation() {
    this.formTypeChanged.next();
    this.rfcNumberValidation = false;
    this.draftNameValidation = false;
    this.filesValidation = false;
    this.draftFileValidation = false;
    this.apiOverview = false;
    this.validationOutput = null;
  }

  validateRfcNumber() {
    if (this.rfcNumberForm.invalid || this.validatingRfcNumberProgress) {
      return;
    }

    this.validatingRfcNumberProgress = true;
    this.validationOutput = null;
    this.rfcError = null;

    this.dataService.validateRfcByNumber(this.rfcNumberForm.get('rfcNumber').value.trim())
      .pipe(
        finalize(() => {
          this.validatingRfcNumberProgress = false
          this.updateURL();
        }),
        takeUntil(merge(this.formTypeChanged, this.componentDestroyed))
      )
      .subscribe(
        (output: ValidationOutput) => {
          if (output.isFinal()) {
            this.validationOutput = output;
            this.scrollToResults();
          } else {
            const modalRef: NgbModalRef = this.modalService.open(MissingModulesSelectionComponent);
            const modalComponent: MissingModulesSelectionComponent = modalRef.componentInstance;
            modalComponent.validationOutput = output;

            modalRef.result.then(
              (choosedRevisionsInput: ChosenMissingRevsInput) => {
                this.validatingRfcNumberProgress = true;

                if (choosedRevisionsInput !== null) {
                  this.dataService.chooseMissingRevsForPreviousRequest(output, choosedRevisionsInput)
                    .pipe(
                      finalize(() => this.validatingRfcNumberProgress = false),
                      takeUntil(this.componentDestroyed)
                    ).subscribe(
                      () => {
                        this.validationOutput = output;
                        this.scrollToResults();
                      },
                      err => this.rfcError = err
                    );
                } else {
                  this.dataService.validateRfcByNumberWithLatestRevisions(this.rfcNumberForm.get('rfcNumber').value.trim())
                    .pipe(
                      finalize(() => this.validatingRfcNumberProgress = false),
                      takeUntil(this.componentDestroyed)
                    )
                    .subscribe(
                      output2 => {
                        this.validationOutput = output2;
                        this.scrollToResults();
                      },
                      err => this.rfcError = err
                    );
                }
              },
              () => {
              }
            );
          }
        },
        err => {
          if (err instanceof (HttpErrorResponse)) {
            this.rfcError = {
              'message': err.error['Error']
            }
          } else {
            this.rfcError = err;
          }
        }
      );
  }

  validateDraftName() {
    if (this.draftNameForm.invalid || this.validatingDraftNameProgress) {
      return;
    }

    this.validatingDraftNameProgress = true;
    this.validationOutput = null;
    this.draftNameError = null;

    this.dataService.validateDraftByName(this.draftNameForm.get('draftName').value.trim())
      .pipe(
        finalize(() => {
          this.validatingDraftNameProgress = false
          this.updateURL();
        }),
        takeUntil(merge(this.componentDestroyed, this.formTypeChanged))
      )
      .subscribe(
        (output: ValidationOutput) => {
          if (output.isFinal()) {
            this.validationOutput = output;
            this.scrollToResults();
          } else {
            const modalRef: NgbModalRef = this.modalService.open(MissingModulesSelectionComponent);
            const modalComponent: MissingModulesSelectionComponent = modalRef.componentInstance;
            modalComponent.validationOutput = output;

            modalRef.result.then(
              (choosedRevisionsInput: ChosenMissingRevsInput) => {
                this.validatingDraftNameProgress = true;

                if (choosedRevisionsInput !== null) {
                  this.dataService.chooseMissingRevsForPreviousRequest(output, choosedRevisionsInput)
                    .pipe(
                      finalize(() => this.validatingDraftNameProgress = false),
                      takeUntil(this.componentDestroyed)
                    ).subscribe(
                      () => {
                        this.validationOutput = output;
                        this.scrollToResults();
                      },
                      err => this.draftNameError = err
                    );
                } else {
                  this.dataService.validateDraftByName(this.draftNameForm.get('draftName').value.trim())
                    .pipe(
                      finalize(() => this.validatingDraftNameProgress = false),
                      takeUntil(this.componentDestroyed)
                    )
                    .subscribe(
                      output2 => {
                        this.validationOutput = output2;
                        this.scrollToResults();
                      },
                      err => this.draftNameError = err
                    );
                }
              },
              () => {
              }
            );
          }
        },
        err => {
          if (err instanceof (HttpErrorResponse)) {
            this.draftNameError = {
              'message': err.error['Error']
            }
          } else {
            this.draftNameError = err;
          }
        }
      );
  }

  validateFiles() {
    if (this.validatingFilesProgress) {
      return;
    }

    this.validatingFilesProgress = true;
    this.validationOutput = null;
    this.filesError = null;

    const formData: FormData = new FormData();
    this.filesForm.form.get('attachments').value.forEach(
      o => formData.append('data', o.file)
    );

    this.dataService.preSetupFilesUpload(false, true)
      .pipe(
        mergeMap(cache => {
          return this.dataService.uploadPreSetFiles(cache, formData);
        }),
        finalize(() => this.validatingFilesProgress = false),
        takeUntil(merge(this.filesForm.selection, this.formTypeChanged, this.componentDestroyed))
      ).subscribe(
        output => {
          this.validatingFilesProgress = false;
          if (output.isFinal()) {
            this.validationOutput = output;
            this.scrollToResults();
          } else {
            const modalRef: NgbModalRef = this.modalService.open(MissingModulesSelectionComponent);
            const modalComponent: MissingModulesSelectionComponent = modalRef.componentInstance;
            modalComponent.validationOutput = output;

            modalRef.result.then(
              (choosedRevisionsInput: ChosenMissingRevsInput) => {
                this.validatingFilesProgress = true;
                this.dataService.chooseMissingRevsForPreviousRequest(output, choosedRevisionsInput)
                  .pipe(
                    finalize(() => this.validatingFilesProgress = false),
                    takeUntil(this.componentDestroyed)
                  ).subscribe(
                    () => {
                      this.validationOutput = output;
                      this.scrollToResults();
                    },
                    err => this.filesError = err
                  );
              },
              () => {
              }
            );
          }
        },
        err => {
          if (err instanceof (HttpErrorResponse)) {
            this.filesError = {
              'message': err.error['Error']
            }
          } else {
            this.filesError = err;
          }
        }
      );
  }

  validateDraftFile() {
    if (this.validatingDraftFileProgress) {
      return;
    }

    this.validatingDraftFileProgress = true;
    this.validationOutput = null;
    this.draftError = null;

    const formData: FormData = new FormData();
    this.draftFileForm.form.get('attachments').value.forEach(
      o => formData.append('data', o.file)
    );

    this.dataService.preSetupFilesUpload(false, true)
      .pipe(
        mergeMap(cache => {
          return this.dataService.uploadPreSetDraftFile(cache, formData);
        }),
        finalize(() => this.validatingDraftFileProgress = false),
        takeUntil(merge(this.draftFileForm.selection, this.formTypeChanged, this.componentDestroyed))
      ).subscribe(
        output => {
          this.validatingDraftFileProgress = false;
          if (output.isFinal()) {
            this.validationOutput = output;
            this.scrollToResults();
          } else {
            const modalRef: NgbModalRef = this.modalService.open(MissingModulesSelectionComponent);
            const modalComponent: MissingModulesSelectionComponent = modalRef.componentInstance;
            modalComponent.validationOutput = output;

            modalRef.result.then(
              (choosedRevisionsInput: ChosenMissingRevsInput) => {
                this.validatingDraftFileProgress = true;
                this.dataService.chooseMissingRevsForPreviousRequest(output, choosedRevisionsInput)
                  .pipe(
                    finalize(() => this.validatingDraftFileProgress = false),
                    takeUntil(this.componentDestroyed)
                  ).subscribe(
                    () => {
                      this.validationOutput = output;
                      this.scrollToResults();
                    },
                    err => this.draftError = err
                  );
              },
              () => {
              }
            );
          }
        },
        err => {
          if (err instanceof (HttpErrorResponse)) {
            this.draftError = {
              'message': err.error['Error']
            }
          } else {
            this.draftError = err;
          }
        }
      );
  }

  onCloseWarning() {
    this.validationOutput.warning = '';
  }

  private subscribeRouteParams() {
    this.route.params.subscribe(params => {
      if (params.hasOwnProperty('validating')) {
        const validatingActions = {
          files: 'showFilesForm',
          'draft-file': 'showDraftFileForm',
          'rfc-number': 'showRfcNumberForm',
          'draft-name': 'showDraftNameForm',
          api: 'showApiOverview'
        };
        if (validatingActions.hasOwnProperty(params['validating'])) {
          this[validatingActions[params['validating']]]();
        }
      }
    });
  }

  private subscribeQueryParams() {
    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('rfc')) {
        this.queryParams['rfc'] = params['rfc'];
        this.rfcNumberForm.get('rfcNumber').setValue(params['rfc']);
        this.setActiveForm('rfcNumber');
        this.validateRfcNumber();
        return;
      }
      if (params.hasOwnProperty('draft')) {
        this.queryParams['draft'] = params['draft'];
        this.draftNameForm.get('draftName').setValue(params['draft']);
        this.setActiveForm('draftName');
        this.validateDraftName();
      }
    });
  }

  private clearErrors() {
    this.filesError = this.draftError = this.rfcError = this.draftNameError = null;
  }

  setActiveForm(form: string) {
    this.activeForm = form;
    this.clearErrors()
  }

  scrollToResults() {
    if (this.validationResults) {
      setTimeout(() => this.validationResults.nativeElement.scrollIntoView(), 100);
    }
  }

  updateURL() {
    this.updateQueryParams();
    const url = this.router.createUrlTree(
      [],
      {
        queryParams: this.queryParams
      }).toString();

    this.location.go(url);
  }

  updateQueryParams() {
    this.queryParams = null;
    const rfcNumber = this.rfcNumberForm.get('rfcNumber').value.trim();
    const draftName = this.draftNameForm.get('draftName').value.trim();
    if (this.activeForm === 'rfcNumber') {
      this.queryParams = {
        'rfc': rfcNumber,
        'draft': null
      }
    } else {
      this.queryParams = {
        'rfc': null,
        'draft': draftName
      }
    }
  }
}
