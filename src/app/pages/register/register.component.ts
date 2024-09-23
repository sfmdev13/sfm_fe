import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/auth.service';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  passwordVisible = false;

  sessionToken = localStorage.getItem('sessionToken')!;
  emailTemp = localStorage.getItem('email')!;

  validateForm= this.fb.group({
    email: [{value: '',  disabled: true}, [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService
  ) { }

  ngOnInit(): void {

    this.spinnerSvc.hide();

    this.validateForm.patchValue({
      email: this.emailTemp,
    });
  }

  submitForm(): void {

    this.spinnerSvc.show();

    if (this.validateForm.valid) {
      this.authService.setPassword(this.validateForm.getRawValue().email, this.validateForm.getRawValue().password, this.sessionToken).subscribe({
        next: (response) => {
          const token = response?.auth_token;
          if(token){
            this.authService.storeToken(token);
            this.router.navigate(['/user']);
          } else {
            console.log('error')
          }
        },
        error: (error) => {
          
          this.spinnerSvc.hide();
          this.modalSvc.error({
            nzTitle: 'Failed to register',
            nzContent: error.error.meta.message,
            nzOkText: 'Ok',
            nzCentered: true
          });
          
        },
        complete: () => {
          this.spinnerSvc.hide();
        }
      })

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });

      this.spinnerSvc.hide();
    }
  }

}
