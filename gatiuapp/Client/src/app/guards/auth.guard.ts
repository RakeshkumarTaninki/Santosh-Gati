import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../Services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  
  constructor(private ss:SharedService, private router: Router){
    
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
      if (localStorage.getItem('access_token')) {
        let token     = localStorage.getItem('access_token')
        let tokenArr  = token.split("-")

        if( !(token && tokenArr.length ) ){   
          this.router.navigate(['']);
          return false
        } 
        
        return true;
      }

      this.router.navigate(['']);
      return false;
  
  }

  canActivateChild(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let token     = localStorage.getItem('access_token');
    
    

    return true;
  }

}
