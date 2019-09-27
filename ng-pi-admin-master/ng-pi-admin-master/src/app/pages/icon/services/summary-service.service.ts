import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SummaryServiceService {

   zones:any=[];
  constructor(private httpClient:HttpClient) { }

  //get company code

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
      //get unapproved pod
      getPendingPOD()
      {
        return this.httpClient.post(environment.apiUrl+"/docket",
      {"ac":"get","un":"testuser","lt":"1"}).pipe(
        map((response: Response) => {        
          return response
        }) );
      }

       //get summary 
    getSummary(userName:any,action:any,frmdate:any,todate:any,location:any,transType:any,companyCode:any)
    {
     
      return this.httpClient.post(environment.apiUrl+"/summary",
      {"un":"testuser",
        "ac":"company",
        "fd":"2019-07-01",
        "ed":"2019-08-01",
        "lc":"BLRNA",
        "tt":"d",
        "cc":"101"}).pipe(
        map((response: Response) => {        
          return response
        }) );
    }
     //POD Approval 
     podApproval(userName:any,action:any,content:any,fname:any,docketNo:any,PODNo:any,userID:any)
     {
       var b={
        "un":userName,
        "ac":action,
        "content":content,
        "fn":fname,
        "dn":docketNo,
         "pn":PODNo, 
         "ui":userID
        };
       console.log(JSON.stringify(b))
       return this.httpClient.post(environment.apiUrltest+"/docket",
       {
        "un":userName,
        "ac":action,
        "content":content,
        "fn":fname,
        "dn":docketNo,
         "pn":PODNo, 
         "ui":userID
        }
         ).pipe(
         map((response: Response) => {        
           return response
         }) );
     }
}
