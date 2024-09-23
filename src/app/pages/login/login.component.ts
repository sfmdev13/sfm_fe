import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth.service';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  passwordVisible = false;

  validateForm= this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private apiSvc: ApiService,
    private modal: NzModalService,
    private spinnerSvc: SpinnerService
  ) { }

  ngOnInit(): void {
  }

  redirectUser():void {
    if(this.authService.hasAction('view_users')) this.router.navigate(['/user']);
    if(this.authService.hasAction('view_projects')) this.router.navigate(['/projects']);
    if(this.authService.hasAction('view_reports')) this.router.navigate(['/reports']);
    if(this.authService.hasAction('view_roles')) this.router.navigate(['/roles']);
    if(this.authService.hasAction('view_settings')) this.router.navigate(['/settings']);
  }

  submitForm(): void {
    this.spinnerSvc.show();
    if (this.validateForm.valid) {
      this.authService.login(this.validateForm.value.email, this.validateForm.value.password).subscribe({
        next: (response) => {
          if(response.data.status === 'NEW_PASSWORD_REQUIRED'){
            this.authService.storeEmailTemp(response.data.email, response.session_token);
            this.router.navigate(['/register']);
          }
          if(response.data.status === 'LOGIN_SUCCESSFUL'){

            const token = response?.auth_token;
            if(token){
              this.authService.storeToken(token);

              this.apiSvc.getProfile().subscribe(
                (profile) => {
                  const userRole =  profile.data.role.actions.map((action: any) => action.slug)
                  localStorage.setItem('pic_id', profile.data.id)
                  localStorage.setItem('actions', JSON.stringify(userRole))
                  this.authService.setUserRoles(userRole);

                  this.redirectUser();
                }
              )

            } else {
              this.spinnerSvc.hide();
              this.modal.error({
                nzTitle: 'Login Failed',
                nzContent: 'Account error',
                nzOkText: 'Ok',
                nzCentered: true
              });
            }
          }
        },
        error: (error) => {
          this.spinnerSvc.hide();
          this.modal.error({
            nzTitle: 'Login Failed',
            nzContent: error.error.meta.message,
            nzOkText: 'Ok',
            nzCentered: true
          });
        },
        complete: () => {
        }
      })


    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}
