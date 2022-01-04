import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AccountService } from './account.service';

@Component({
  selector: 'yc-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  form: FormGroup;
  error: any;
  progress = false;
  result: any;
  siteKey: string;
  fieldValidators = [Validators.required, Validators.maxLength(255)];

  private componentDestroyed: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder, private dataService: AccountService) {
    this.siteKey = environment.CAPTCHA_SECRET_KEY;
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      username: ['', this.fieldValidators],
      password: ['', this.fieldValidators],
      passwordConfirm: ['', this.fieldValidators],
      email: ['', this.fieldValidators],
      company: ['', this.fieldValidators],
      firstName: ['', this.fieldValidators],
      lastName: ['', this.fieldValidators],
      motivation: ['', this.fieldValidators],
      recaptcha: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }

  onCloseError() {
    this.error = null;
  }

  onCreateAccountClick() {
    if (this.form.invalid) {
      return;
    }

    this.result = '';
    this.error = null;
    this.progress = true;

    this.dataService.createUser({
      username: this.form.get('username').value,
      password: this.form.get('password').value,
      'password-confirm': this.form.get('passwordConfirm').value,
      email: this.form.get('email').value,
      company: this.form.get('company').value,
      'first-name': this.form.get('firstName').value,
      'last-name': this.form.get('lastName').value,
      motivation: this.form.get('motivation').value
    }).pipe(
      finalize(() => this.progress = false),
      takeUntil(this.componentDestroyed)
    ).subscribe(
      ok => {
        this.result = 'User was successfuly created';
        this.form.reset();
      },
      err => {
        console.log(err);
        this.error = err;
      }
    );
  }
}
