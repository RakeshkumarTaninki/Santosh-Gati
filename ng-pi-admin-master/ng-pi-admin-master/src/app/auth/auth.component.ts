import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from './service/auth-service.service';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  formValid:boolean = false;
  constructor(private router:Router,private authService:AuthServiceService) { }

  ngOnInit() {
  }
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
  authenticate():Promise<any>{
    

    let userDataJSON:string = (<HTMLInputElement>document.getElementById('userData')).value

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
    

    
   this.authService.authenticate(userDataJSON) .pipe(first())
   .subscribe( data => {
    this.onSuccess(data);
},
error => {
  this.onError(error);
});
  


    
  }

  onSuccess(responseData:any)
{
 //alert(responseData.token)
  //this.loginService.changeBlockUI({start:false, message:''});
           //  this.loading = false;
             localStorage.setItem("access_token", responseData.token);            
            // this.router.navigate(['gati', 'dashboard']) ;     
           this.router.navigate(['pages/index']);
}

onError(error:any){
  //alert(JSON.stringify(error));                        

  if(error.status >= 500)
  alert('Internal Server Error. Please Contact Support Team.');                        

if(error.status >=400 && error.status< 500){
  this.router.navigate(['404']);                     
}
}
}
