import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      // Check if route requires specific role
      const requiredRole = route.data['role'] as string;
      
      if (requiredRole && ! this.authService.hasRole(requiredRole)) {
        // User doesn't have required role, redirect to unauthorized
        this.router.navigate(['/unauthorized']);
        return false;
      }
      
      return true;
    }

    // Not logged in, redirect to login with return URL
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}