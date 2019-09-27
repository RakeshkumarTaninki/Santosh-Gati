import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { debug } from 'util';
import { environment } from '../../environments/environment';

@Injectable()
export class gaListService {
  apiUrl = environment.apiUrl;
  constructor(private http: Http) {
  }


  docketStatusGet(locationCode) {
    return this.http.get(this.apiUrl + 'backoffice/todaydeliverystatus?locationCode=' + `${locationCode}`,this.auth())
      .pipe(map((response: Response) => {
        return response.json();
      }
      ));

  }
  gaDeliveryStatusDetails(agentCode, locationCode) {

    return this.http.get(this.apiUrl + 'backoffice/todaydeliverystatusbygacode?agentCode=' + `${agentCode}`+ '&locationCode=' + `${locationCode}`,this.auth())
      .pipe(map((response: Response) => {
        return response.json();
      }
    ));
  }

  gaList(searchParam, limit, locationCode) {
    var pageNo = 0;
    return this.http.get(this.apiUrl + 'backoffice/fetchganame?offset=' + `${pageNo}` + '&limit=' + `${limit}` + '&searchParam=' + `${searchParam}`  + '&locationCode=' + `${locationCode}`,this.auth())
      .pipe(map((response: Response) => {
        return response.json();
      }
    ));
  }

  allgaDetailList(searchParam, limit, locationCode) {
    var pageNo = 0;
    return this.http.get(this.apiUrl + 'backoffice/fetchtodayalldeliverydetails?offset=' + `${pageNo}` + '&limit=' + `${limit}` + '&searchParam=' + `${searchParam}` + '&locationCode=' + `${locationCode}`,this.auth())
      .pipe(map((response: Response) => {
        return response.json();
      }
      ));
  }



  enableDisableUser(gaCode, status){
    let token = localStorage.getItem("access_token");
    let headers = new Headers({ "Content-Type": "application/json"});
    headers.append("authorization", "Basic "+token)
    
    let options = new RequestOptions({ headers: headers });
   
    let url = "backoffice/user/status?agentCode="+gaCode+"&status="+status
    return this.http.post(this.apiUrl +url, null, options).pipe(
      map((response: Response) => {        
        return response.json()
      }) 
    ); 
  }

  resetPassword(gaCode){
    let token = localStorage.getItem("access_token");
    let headers = new Headers({ "Content-Type": "application/json"});
    headers.append("authorization", "Basic "+token)
    
    let options = new RequestOptions({ headers: headers });


    let url = "backoffice/reset/password?agentCode="+gaCode;
    return this.http.post(this.apiUrl +url, null, options).pipe(
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

}
