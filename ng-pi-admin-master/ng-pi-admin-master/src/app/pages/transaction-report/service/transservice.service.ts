import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransserviceService {

  constructor(private httpClient:HttpClient) { }

  //get zones
  getZones(companyCode:any)
  {
     return this.httpClient.post(environment.apiUrl+"/zones",{"cc": companyCode,"un":"testuser"}).pipe(
      map((response: Response) => {        
        return response
      }) );
  }
  //get EDC 
  getEDC(companyCode:any,zoneCode:any)
  {
   
    return this.httpClient.post(environment.apiUrl+"/edcCodes",{"cc": companyCode,"un":"testuser","zc":zoneCode}).pipe(
      map((response: Response) => {        
        return response
      }) );
  }
   //get GDW
   getGDW(companyCode:any,zoneCode:any,edcCode:any)
   {
    
     return this.httpClient.post(environment.apiUrl+"/gdwCodes",
     {"cc": companyCode,"un":"testuser","zc":zoneCode,"ec":edcCode}).pipe(
       map((response: Response) => {        
         return response
       }) );
   }
    //get OU
    getOUCode(companyCode:any,zoneCode:any,edcCode:any,gdwCode:any)
    {
     
      return this.httpClient.post(environment.apiUrl+"/ouCodes",
      {"cc": companyCode,"un":"testuser","zc":zoneCode,"ec":edcCode,"gc":gdwCode}).pipe(
        map((response: Response) => {        
          return response
        }) );
    }
     //get docket transactions types
     getTransactions()
     {
      
       return this.httpClient.get(environment.apiUrlLocal+"/delivered_master.json")
     }
      //get Groups
      getGroups()
      {
       
        return this.httpClient.get(environment.apiUrlLocal+"/group_summary.json")
      }
}
