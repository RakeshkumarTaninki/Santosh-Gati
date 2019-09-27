import { Component, OnInit ,ViewChild} from '@angular/core';
import { RunsheetServiceService } from '../upload-runsheet/runsheet-service.service';
declare var $: any;
import {  ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { ImageCompressService, ResizeOptions, ImageUtilityService, IImage, SourceImage } from  'ng2-image-compress';
import { SummaryServiceService } from './services/summary-service.service';
import { Observable, Observer } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';



 
@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  model;
  runsheettab:boolean;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  processedImages: any='';
  
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
  pod:any=null;
  podPage:any;
  podTotal:any;
  pdcNo:any;
  docketNo:any;
  userName:any;
  frmDate:any;
  toDate:any;
  fname: any;
  userID: any;
  action: any;
  location:any;
  DocketList:any;

  constructor(private runsheetService:RunsheetServiceService
    ,private imgCompressService: ImageCompressService
    ,private summaryService:SummaryServiceService) { 
    this.runsheettab=false;
  }

  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
  ngOnInit() {
    this.runsheettab=false;
    this.selectedComanyCode=this.CompanyCode[0];
    this.onChangeCompany(this.selectedComanyCode);
    this.setTransactions();
    this.setGroups();
  }

//set all value in trnsactions types
setTransactions()
{
   this.summaryService.getTransactions().subscribe(
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
   this.summaryService.getGroups().subscribe(
     (data)=>{ this.Groups=data;
      if(this.Groups[0]!=undefined)
      this.selectedGroup=this.Groups[0];
    },
    (error)=>{
      alert(JSON.stringify(error));
    }
   )
}


  showrunsheet()
  {
    this.showModal();
  }

  showModalSDC():void {
    $("#sdcUpload").modal('show');
  }
  showModalbad():void {
    $("#badUpload").modal('show');
  }
  showModal():void {
    $("#myModal").modal('show');
  }
  showModalpod():void {
    $("#podApprovalModal").modal('show');
    this.summaryService.getPendingPOD().subscribe(
      (data)=>{
        this.pod=data;
        this.podPage=1;
        this.podTotal=this.pod[0].status;
        this.pdcNo=this.pod[0].PDC_NO;
        this.docketNo=this.pod[0].DOCKET_NO;
        this.imageChangedEvent="http://dr285tvhljuh5.cloudfront.net/"+this.pod[0].POD_IMAGE_NAME;
        this.setCropperImage(this.imageChangedEvent);
       console.log("http://dr285tvhljuh5.cloudfront.net/"+this.pod[0].POD_IMAGE_NAME)
      }
    )
  }
  async setCropperImage (url: string) {
   // this.imageChangedEvent=this.getBase64ImageFromURL(url);
   
    const result: any = await fetch (url);
    const blob = await result.blob ();
    let reader = new FileReader ();
    reader.readAsDataURL (blob);
    reader.onload = () => {
    console.log (reader.result);
    this.imageChangedEvent = reader.result;
    }
    }
    
  hideModal(modalId):void {
     $("#"+modalId).modal('hide');
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
}
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
}
imageLoaded() {
    // show cropper
}
cropperReady() {
    // cropper ready
}
loadImageFailed() {
    // show message
}
rotateLeft() {
  this.imageCropper.rotateLeft();
}
rotateRight() {
  this.imageCropper.rotateRight();
}
flipHorizontal() {
  this.imageCropper.flipHorizontal();
}
flipVertical() {
  this.imageCropper.flipVertical();
}

compressFile() {

  ImageCompressService.filesToCompressedImageSource(this.imageChangedEvent.target.files).then(observableImages => {
    observableImages.subscribe((image) => {
     // this.croppedImage =image;
      this.imageChangedEvent.target.file=image;
    }, (error) => {
      console.log("Error while converting");
    });
  });
  
}

onChangeCompany(companyCode:any)
{
  
  this.ZoneCodes=[];
  this.EDCCodes=[];
  this.GDWCodes=[];
  this.OUCodes=[];
 this.summaryService.getZones(this.selectedComanyCode).subscribe(
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
  this.EDCCodes=[];
  this.GDWCodes=[];
  this.OUCodes=[];
 if(zoneCode==undefined)
 zoneCode=this.selectedZoneCode;
 this.summaryService.getEDC(this.selectedComanyCode,zoneCode).subscribe(
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
  this.GDWCodes=[];
  this.OUCodes=[];
 this.selectedEDCCode=edcCode;
 this.summaryService.getGDW(this.selectedComanyCode,this.selectedZoneCode,this.selectedEDCCode).subscribe(
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
  this.OUCodes=[];
 this.selectedGDWCode=zoneCode;
 this.summaryService.getOUCode(this.selectedComanyCode,this.selectedZoneCode,this.selectedEDCCode,this.selectedGDWCode).subscribe(
   (data)=>{
    this.OUCodes=data;
   },
   (error)=>{
     alert("error:"+error);
   }
 )
}

//get summary
getSummary()
{
  this.userName="testUser";
  this.action="company";
  this.frmDate;
  this.toDate;
  this.location="BLRNA";
  
  this.selectedComanyCode
  
  this.summaryService.getSummary(this.userName,this.action,this.frmDate,this.toDate,this.location, this.selectedTransaction.substring(0,1),this.selectedComanyCode)
  .subscribe(
    (data)=>{
      this.DocketList=data;
    }
    ,
    (error)=>{
      alert(error)
    }
  )
}

//approve POD
PODApprove()
{
  this.userID="123456asv";
  this.userName="testUser";
  this.action="approve";
  this.fname="test.jpg";
  var base64Img = this.croppedImage;
  base64Img = base64Img.replace("data:image/png;base64,", "");
 
  this.summaryService.podApproval(this.userName,this.action,base64Img,this.fname,this.docketNo,this.pdcNo,this.userID)
  .subscribe(
    (data)=>{
      alert(JSON.stringify(data))
    },
  (error)=>{
    alert(JSON.stringify(error))
  }

  )
}

}
