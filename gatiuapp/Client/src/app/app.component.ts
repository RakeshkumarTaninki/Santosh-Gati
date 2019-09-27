import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SharedService } from './Services/shared.service';
import { Router, Route, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  //authenticated:boolean = false;
  //testing:boolean       = true;

  title                 = 'Client';
  counter               = 0;
  rbackPage             = false;
  currentUrl:string     = ""
  subscription:Subscription[] = []

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private location:Location,
    private ss: SharedService,
    private router: Router,
    private ref:ChangeDetectorRef
  ){ }
  
  
  ngOnInit(){
    let sub1, sub2, sub3, sub4;
    
    sub1 = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl = event.url;

        if(this.currentUrl == "/authenticating" || this.currentUrl == "/"){
          this.rbackPage =  true;
          return ;
        }
        else{
          this.rbackPage =  false;          
        }
      }
    });

    this.subscription.push(sub1);

     setTimeout(()=>{

        if(!this.rbackPage && this.currentUrl )
          this.ss.changeBlockUI({start:true, message:'Authenticating...'});
        
        let token = localStorage.getItem("access_token");
        
        if(!this.rbackPage && this.currentUrl ){
          if(!token){
             this.ss.changeBlockUI({start:false, message:''});
             this.router.navigate(['/404']);
          }

        }
        
        sub2 =this.ss.blockUI$.subscribe(
          (blockVal)=>{
            if(blockVal.start){
              this.blockUI.start(blockVal.message); // Start blocking
            }
    
            else if(!blockVal.start){
              this.blockUI.stop();                  // Stop blocking
            }
          },
        );

        this.subscription.push(sub2);
        
         sub3= this.ss.adminUserJSON$.subscribe(
           (newUserJsonVal)=>{
             if(this.counter){
            
              if(!newUserJsonVal || this.ss.isEmpty(newUserJsonVal)){               
                if(!this.rbackPage && this.currentUrl ){
                  this.router.navigate(['/404']);
                }  
              }
              else{
                this.ss.changeBlockUI({start:false, message:''})                
              }            
             }
             this.counter++;
           }
         )

         this.subscription.push(sub3);
        
         
         if(!this.rbackPage && this.currentUrl && token){
           sub4 = this.ss.getAuthorization(token).subscribe(
             (success)=>{            
               this.ss.changeAdminUserJSON(success);  
             },        
             (error)=>{
               this.ss.changeAdminUserJSON(null);        
             }
           );
          this.subscription.push(sub4);
         }
   }, 450)  //setTimeout
    
  } //init


  ngOnDestroy(){
    this.ss.changeAdminUserJSON(null);
    this.subscription.forEach(s => s.unsubscribe());
  }

} //cmp