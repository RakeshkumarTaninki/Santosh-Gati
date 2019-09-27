import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../../Services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userJSON:any;
  accessArr:any               = [];
  underlineDashboard          = false;
  subscription:Subscription[] = []
  authenticated:boolean       = false;
  loggedInUsername:string     = "";

  constructor(
    private ss:SharedService,
    private route:ActivatedRoute,
    private router:Router,
    private ref: ChangeDetectorRef
  ) { 
    
  }
  
  ngOnInit() {

    let token = localStorage.getItem("access_token");
    if(token){
      this.ss.getAuthorization(token).subscribe(
        (success)=>{          
          this.authenticated = true;  
          this.ss.changeAdminUserJSON(success);  
        },        
        (error)=>{
          this.authenticated = false;
          this.ss.changeAdminUserJSON(null);        
        }
      );
    }

    let sub1 = this.ss.currentPage$.subscribe((data)=>{
      if(data=="/gati/dashboard"){        
        this.underlineDashboard = true;
        this.ref.detectChanges();
      }else{
        this.underlineDashboard = false        
        this.ref.detectChanges();        
      }
    })

    let sub2 = this.ss.adminUserJSON$.subscribe(
      (newUserJsonVal)=>{
        this.userJSON = newUserJsonVal;
        
        if(newUserJsonVal && !this.ss.isEmpty(newUserJsonVal) && this.userJSON.userDtls ){
          this.loggedInUsername = this.userJSON.userDtls[0].userName;
          this.userJSON.userDtls[0].screenInfo.forEach((el, idx) => {   
            if(el.accessLevel=="999")           
              this.accessArr.push( this.ss.screenCodeAccessMapping[el.screenCode] );
          });
        }
      },

      (error)=>{
        this.userJSON = null;
      }
    )

    this.subscription.push(sub1, sub2);

  } //Init


  ngOnDestroy(){
    this.subscription.forEach(s => s.unsubscribe());
  }

}
