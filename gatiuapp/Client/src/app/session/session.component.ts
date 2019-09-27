import { Component, OnInit, OnDestroy } from '@angular/core';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  
})
export class SessionComponent implements OnDestroy {

  constructor(
    private router: Router,
    private idle: Idle, 
    private keepalive: Keepalive
  ) {
      // sets an idle timeout of 5 seconds, for testing purposes.
      this.idle.setIdle(5);
     
      // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
      this.idle.setTimeout(1800);
     
      // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
      this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
     
      this.idle.onIdleEnd.subscribe(() => {});
     
      this.idle.onTimeout.subscribe(() => {
        alert("Authentication expired. Please re-authenticate and try again.");
        
        localStorage.clear();
        this.router.navigate(['/404']); 
      });
     
      // sets the ping interval to 15 seconds
      this.keepalive.interval(15);
     
      this.keepalive.onPing.subscribe(() => {});
     
      this.reset();   	
    }
    
    
    reset() {
      this.idle.watch();
    }
    
	  ngOnDestroy() {
    	this.idle.ngOnDestroy();
	  }
}
