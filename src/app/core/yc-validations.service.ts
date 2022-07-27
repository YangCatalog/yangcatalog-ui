import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class YcValidationsService {

  constructor() { }

  getNumberValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      return (control.value && (!Number(control.value) && control.value !== '0')) ? { 'notNumber': { value: control.value } } : null;
    };
  }

  regexpValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.parent) {
        return null;
      }
      var isRegexSearch = control.parent.get('searchOptions').get('regularExpression').value;
      var isValid = true;
      try {
        new RegExp(control.value);
      } catch (e) {
        isValid = false;
      }
      return (isRegexSearch && !isValid) ? { 'notValidRegex': { value: control.value } } : null;
    };
  }

}
