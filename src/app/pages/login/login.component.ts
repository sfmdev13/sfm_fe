import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth.service';

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
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {
  }

  submitForm(): void {
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
                  
                  this.router.navigate(['/user']);
                }
              )

            } else {
              console.log('error')
            }
          }
        },
        error: (error) => {
          console.log(error)
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
