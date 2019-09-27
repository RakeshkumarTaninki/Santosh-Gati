import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import { AlertService } from '../alert.service';


@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  constructor(
    public snackBar: MatSnackBar,
    private _vcr: ViewContainerRef,
    private alertService:AlertService
  ){ 


  }

  ngOnInit() {
    let snackBarClass = "";

    this.alertService.getMessage().subscribe(msg => {             
      
      if(msg){      
        snackBarClass=msg.type+"-snackbar"
      
        let sb = this.snackBar.open(msg.text, msg.action, {
          panelClass: [snackBarClass],
          duration:2500,
          viewContainerRef: this._vcr,
          verticalPosition:"top",
          horizontalPosition:"right"
        });
        
      }
      
      else this.snackBar.dismiss()
    
    });

  }

}
