import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean{
    if(this.authService.isAuthenticated()){
      return true;
    } else {
      this.router.navigate(['/login']);
      return false
    }
  }
  
}
