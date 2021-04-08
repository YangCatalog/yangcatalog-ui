import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { YangRegexValidatorService } from './yang-regex-validator.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ErrorMessage } from 'ng-bootstrap-form-validation';
import { YangRegexAboutComponent } from './yang-regex-about/yang-regex-about.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'yc-yang-regex-validator',
  templateUrl: './yang-regex-validator.component.html',
  styleUrls: ['./yang-regex-validator.component.scss']
})
export class YangRegexValidatorComponent implements OnInit, OnDestroy {

  form: FormGroup;

  customPatternErrorMessages: ErrorMessage[] = [
    {
      error: 'required',
      format: (label, error) => `${label} is required`
    }, {
      error: 'backend',
      format: this.getPatternBackendError.bind(this)
    }
  ];


  error: any;
  private componentDestroyed: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder, private dataService: YangRegexValidatorService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      patterns: this.fb.array([
        this.createPatterFormGroup()
      ]),
      testStr: this.fb.control('', [Validators.required])
    });
    this.form.get('testStr').valueChanges.pipe(takeUntil(this.componentDestroyed)).subscribe(() => {
      const patFormArr = this.form.get('patterns') as FormArray;
      patFormArr.controls.forEach(patFg => patFg.get('result').setValue(null));
    });
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }


  addPattern(i: number) {
    const formArr = this.form.get('patterns') as FormArray;
    formArr.insert(i + 1, this.createPatterFormGroup());
  }

  removePattern(i: number) {
    const formArr = this.form.get('patterns') as FormArray;
    formArr.removeAt(i);
  }

  private createPatterFormGroup(): FormGroup {
    const patternControl = this.fb.control('', [Validators.required]);
    const invertedControl = this.fb.control(false);
    const patternGroup = this.fb.group({
      pattern: patternControl,
      inverted: invertedControl,
      progress: this.fb.control(false),
      result: this.fb.control(null),
      backendError: this.fb.control('')
    });

    patternControl.valueChanges.subscribe(() => patternGroup.get('result').setValue(null));
    invertedControl.valueChanges.subscribe(() => patternGroup.get('result').setValue(null));
    return patternGroup;
  }

  onValidateYangcatalogClick() {

    if (this.form.invalid) {
      return;
    }

    const formArr = this.form.get('patterns') as FormArray;
    formArr.controls.forEach((fg: FormGroup, index: number) => {
      this.initPatternValidation(fg);

      this.getPatternValidationObservable(fg, index, this.dataService.getYangcatalogValidation.bind(this.dataService)).subscribe(
        result => {
          fg.get('result').setValue(result);
          if (result['result'] > 1) {
            fg.get('pattern').setErrors({backend: true});
            fg.get('backendError').setValue(result['output']);
          }
        },
        err => {
          this.handleError(err);
        }
      );

    });

  }

  private getPatternValidationObservable(patternFormGroup: FormGroup, patternNumber: number, serviceMethod: any) {
    return serviceMethod(
      patternFormGroup.get('pattern').value,
      patternFormGroup.get('inverted').value as string + '',
      this.form.get('testStr').value,
      patternNumber
    ).pipe(
      finalize(() => {
        patternFormGroup.get('progress').setValue(false);
      }),
      takeUntil(this.componentDestroyed)
    );
  }

  private initPatternValidation(fg: FormGroup) {
    fg.get('result').setValue(null);
    fg.get('backendError').setValue('');
    fg.get('progress').setValue(true);
  }

  onValidateW3cClick() {
    if (this.form.invalid) {
      return;
    }

    const formArr = this.form.get('patterns') as FormArray;
    formArr.controls.forEach((fg: FormGroup, index: number) => {
      this.initPatternValidation(fg);

      this.getPatternValidationObservable(fg, index, this.dataService.getW3cValidation.bind(this.dataService)).subscribe(
        result => {
          fg.get('result').setValue(result);
          if (result['result'] < 0 || result['result'] > 1) {
            fg.get('pattern').setErrors({backend: true});
            fg.get('backendError').setValue(result['output']);
          }
        },
        err => {
          this.handleError(err);
        }
      );

    });
  }

  onInvertMatchClick(i: number) {
    const formArr = this.form.get('patterns') as FormArray;
    formArr.at(i).get('inverted').setValue(!formArr.at(i).get('inverted').value);
  }

  getPatternBackendError(label: string) {
    const labelArr = label.split(' ');
    const formIndex = parseInt(labelArr[1], 10) - 1;
    const patternsArr = this.form.get('patterns') as FormArray;
    return patternsArr.at(formIndex).get('backendError').value;
  }

  onAboutClick() {
    this.modalService.open(YangRegexAboutComponent, {
      size: 'lg'
    });
  }

  private handleError(err) {
    this.error = err;
  }

  onCloseError() {
    this.error = null;
  }
}
