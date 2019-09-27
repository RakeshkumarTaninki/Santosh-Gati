import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { SharedService } from '../Services/shared.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'rbac',
  templateUrl: './rbac-auth.component.html',
  styleUrls: ['./rbac-auth.component.scss']
})
export class RbacAuthComponent implements OnInit {
  env               = environment;
  apiGateway:string = ""
  loading:boolean   = false;
  formValid:boolean = false;
  subscription:Subscription[] = []

  constructor(
      private ss:SharedService,
      private router:Router
  ) { }

  ngOnInit() {
    this.apiGateway =   this.env.apiUrl
} //onInit


  isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {                    
        return false;
    }
    return true;
  }

  onUserDataKeyUp(e){
      if(e.target.value && ( <HTMLInputElement>document.getElementById('userData')).value )
        this.formValid = true;
      else this.formValid = false;
  }

  authenticate(){
    var ans ="Are you sure to submit?"
    if(!ans) return;

    let userDataJSON:any = (<HTMLInputElement>document.getElementById('userData')).value

    if( !userDataJSON) {
        alert('Please Enter User Data');
        return;
    }
    else{
        if(!this.isJsonString(userDataJSON)){
            alert("Please Enter User Data in JSON Format");
            return ;
        }
    }

    let userData    = JSON.parse(userDataJSON);
    this.loading    = true;

    this.ss.changeBlockUI({start:true, message:'Authenticating...'});

    let sub = this.ss.authenticate(userData).subscribe(
        (data)=>{            
             this.ss.changeBlockUI({start:false, message:''});
             this.loading = false;
             localStorage.setItem("access_token", data.token);            
             this.router.navigate(['gati', 'dashboard']) ;             
        },
        (error)=>{

            this.ss.changeBlockUI({start:false, message:''});
            this.loading = false;

            if(error.status >= 500)
                alert('Internal Server Error. Please Contact Support Team.');                        

            if(error.status >=400 && error.status< 500){
                console.log("Error", error.json()); 
                alert("Error:"+ error.json());                        
            }
        }
    );


    this.subscription.push(sub);

  } //authenticate Fn


  ngOnDestroy(){
    this.ss.changeAdminUserJSON(null);
    this.subscription.forEach(s => s.unsubscribe());  
  }

} //componentEnds