import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http:HttpClient) { }

  authenticate(userData:string){
    let headers = new HttpHeaders({ "Content-Type": "application/json"});
    
    let  url    = environment.apiUrlOld + "auth/backoffice/rbac"
    return this.http.post(url, userData).pipe(
      map((response: Response) => {        
        return response
      }) 
    )
}
}