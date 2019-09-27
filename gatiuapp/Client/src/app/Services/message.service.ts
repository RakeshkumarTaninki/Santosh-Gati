import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Response, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  apiUrl = environment.apiUrl;

  constructor(private http: Http) { }

  
  fetchPNFilterData(filter){
    return this.http.post(this.apiUrl + 'pushnotification/filterdata', filter, this.auth()).pipe(
      map((response: Response) => {        
        return response.json()
      }) 
    ); 
  }


  broadcastMessage(messageData){
    let endpoint = "pushnotification/pushnotificationsend";
    return this.http.post(this.apiUrl + endpoint, messageData, this.auth()).pipe(
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
