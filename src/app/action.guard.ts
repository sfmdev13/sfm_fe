import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ActionGuard  {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredAction = route.data['action'];

    if (!this.authService.hasAction(requiredAction)) {
      this.router.navigate(['unauthorized']);
      return false;
    }
    return true;
  }
}