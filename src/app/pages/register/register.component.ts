import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.validateForm.patchValue({
      email: this.emailTemp,
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.authService.setPassword(this.validateForm.getRawValue().email, this.validateForm.getRawValue().password, this.sessionToken).subscribe(
        (response) => {
          const token = response?.auth_token;
          if(token){
            this.authService.storeToken(token);
            this.router.navigate(['/user']);
          } else {
            console.log('error')
          }
        },
        (error) => {
          console.log(error);
        }
      )
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
