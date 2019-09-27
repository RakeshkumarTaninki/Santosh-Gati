import { Component, OnInit } from '@angular/core';
import { TransserviceService } from './service/transservice.service';
declare var $: any;
@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.scss']
})
export class TransactionReportComponent implements OnInit {

  constructor(private trans:TransserviceService) { }
  CompanyCode:any=[101,102];
  ZoneCodes:any=[];
  EDCCodes:any=[];
  GDWCodes:any=[];
  OUCodes:any=[];
  Transactions:any=[];
  Groups:any=[];
  selectedComanyCode:any;
  selectedZoneCode:any;
  selectedEDCCode:any;
  selectedGDWCode:any;
  selectedOUCode:any;
  selectedTransaction:any;
  selectedGroup:any;
  
  ngOnInit() {
    this.selectedComanyCode=this.CompanyCode[0];
    this.onChangeCompany(this.selectedComanyCode);
    this.setTransactions();
    this.setGroups();
   
  }
  //set all value in trnsactions types
setTransactions()
{
   this.trans.getTransactions().subscribe(
     (data)=>{ this.Transactions=data;
      if(this.Transactions[0]!=undefined)
      this.selectedTransaction=this.Transactions[0];
    },
    (error)=>{
      alert(JSON.stringify(error));
    }
   )
}

//set all value in Groups
setGroups()
{
   this.trans.getGroups().subscribe(
     (data)=>{ this.Groups=data;
      if(this.Groups[0]!=undefined)
      this.selectedGroup=this.Groups[0];
    },
    (error)=>{
      alert(JSON.stringify(error));
    }
   )
}

onChangeCompany(companyCode:any)
{
  

 this.trans.getZones(this.selectedComanyCode).subscribe(
   (data)=>{
    this.ZoneCodes=data;
    if(this.ZoneCodes[0]!=undefined){
    this.selectedZoneCode=this.ZoneCodes[0];
    this.onChangeZone(this.selectedZoneCode);
    }
   },
   (error)=>{
     alert("error:"+JSON.stringify(error));
   }
 )
 this.selectedComanyCode=companyCode;
}

onChangeZone(zoneCode:any)
{
 if(zoneCode==undefined)
 zoneCode=this.selectedZoneCode;
 this.trans.getEDC(this.selectedComanyCode,zoneCode).subscribe(
   (data)=>{
    this.EDCCodes=data;
    if(this.EDCCodes[0]!=undefined){
      this.selectedEDCCode=this.EDCCodes[0];
      this.onChangeEDC(this.selectedEDCCode);
    }
   },
   (error)=>{
     alert("error:"+error);
   }
 )
 this.selectedZoneCode=zoneCode;
}


onChangeEDC(edcCode:any)
{
 this.selectedEDCCode=edcCode;
 this.trans.getGDW(this.selectedComanyCode,this.selectedZoneCode,this.selectedEDCCode).subscribe(
   (data)=>{
    this.GDWCodes=data;
   },
   (error)=>{
     alert("error:"+error);
   }
 )
}
onChangeGDW(zoneCode:any)
{
 this.selectedGDWCode=zoneCode;
 this.trans.getOUCode(this.selectedComanyCode,this.selectedZoneCode,this.selectedEDCCode,this.selectedGDWCode).subscribe(
   (data)=>{
    this.OUCodes=data;
   },
   (error)=>{
     alert("error:"+error);
   }
 )
}

}
