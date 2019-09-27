import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';

@Injectable()
export class AlertService {

  private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(private router: Router) {
      // clear alert message on route change
      router.events.subscribe(event => {
        if(event instanceof NavigationStart) {

            if (this.keepAfterNavigationChange) {
                // only keep for a single location change
                this.keepAfterNavigationChange = false;
            } 
            
            else {
                // clear alert
                this.subject.next();
            }
        }
      });
    }


    success(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'success', text: message, action:'' });
    }
    
    error(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'error', text: message, action:'' });
    }
    
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
