import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Http, Response, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import {map} from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  apiUrl = environment.apiUrl;
  applyAuth = false;
  screenCodeAccessMapping = 
  {
    101: 'user_profile',
    102: 'broadcast',
    103: 'chat',
    104: 'password_reset',
    105: 'geo_fence',
    106: 'tran_rpt',
    107: 'stra_rpt',
    108: 'qc_check',
    109: ''
  } ;

  constructor(private http:Http) { }

  public blockUI = new BehaviorSubject<any>([]);
  blockUI$ = this.blockUI.asObservable();
  changeBlockUI(val:any){
    this.blockUI.next(val);
  }


  public adminUserJSON = new BehaviorSubject<any>({});
  adminUserJSON$ = this.adminUserJSON.asObservable();
  changeAdminUserJSON(val:any){
    this.adminUserJSON.next(val);
  }


  public currentPage = new BehaviorSubject<any>("");
  currentPage$ = this.currentPage.asObservable();
  changeCurrentPage(val:any){
    this.currentPage.next(val);
  }




  getAuthorization(token){
    let endpoint = `auth/backoffice/rbac?token=${token}`;

    return this.http.get(this.apiUrl + endpoint, this.auth()).pipe(
      map((response: Response) => {        
        return response.json()
      }) 
    ); 
  }


  private auth(){
    let headers = new Headers({
      'authorization':'Basic ' + localStorage.getItem('access_token')
    });
    headers.append("Content-Type", "application/json");
    return new RequestOptions({ headers: headers });
  }


  isEmpty(obj){
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
    }
    return true;
  }

  authenticate(userData){
    let headers = new Headers({ "Content-Type": "application/json"});
    let options = new RequestOptions({ headers: headers });
    let  url    = this.apiUrl + "auth/backoffice/rbac"

    return this.http.post(url, userData, options).pipe(
      map((response: Response) => {        
        return response.json()
      }) 
    )

  } //fn

}
