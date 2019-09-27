import { Component, OnInit, ViewChild } from '@angular/core';
import { gaListService } from '../../Services/index';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SharedService } from '../../Services/shared.service';
import { Location } from '@angular/common';
import { AlertPromise } from 'selenium-webdriver';
import { AlertService } from '../../alert.service';
import { ChatService } from '../../Services/chat.service';
import { DemoAdapter } from '../../Home/dashboard/DemoAdapter';
import { AngularFirestore } from 'angularfire2/firestore';
import { ChatAdapter } from '../../ng-chat/core/chat-adapter';
import { IChatController } from '../../ng-chat/core/chat-controller';
import { UserStatus } from '../../ng-chat/core/user-status.enum';
import {map} from 'rxjs/operators'


@Component({
  selector: 'app-galist-details',
  templateUrl: './galist-details.component.html',
  styleUrls: ['./galist-details.component.scss']
})

export class GAlistDetailsComponent implements OnInit {

  @ViewChild('chatInstance') protected chatInstance: IChatController;  
  today=new Date();

  items: any = [];
  lat: number = 51.678418;
  lng: number = 7.809007;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  SearchText: any;
  direction = '';
  Title: string = 'Dockets';
  Titleheading: any = ["COD Amount"];
  totalCOD: any = [0];
  Delivered: number = 0;
  Undelivered: number = 0;
  Attempted: number = 0;
  NotAttempted: number = 0;
  POD: number = 0;
  totalDockets: number = 0;
  DocketPercentage: any = 0;
  CODpercentage: any = 0;
  mb: any = 0;
  iEMI:any;
  mobileOS:any;
  appVersion:any;
  mobileModel:any;
  listdata: any;
  searchedParam: string = '';
  isScroll: boolean = false;
  limit: number = 10;
  finallimit: number = 10;
  TotalItems: any;
  isloading: boolean = false;
  agentCode: any;
  agentName: string;
  searchedGaCode: any;
  searchedGaName: string;
  isSearchedDetails: boolean = false;
  userJSON:any;
  accessArr:any = []
  authenticated:boolean = false;
  ouCode:string;
  isEnabled:boolean
  showCtxMenu:boolean = false;
  
  fbLoggedInUserId:string;
  public adapter: ChatAdapter;


  constructor(
    private gaListService: gaListService, 
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private ss:SharedService,
    private location: Location,
    private alertService:AlertService,
    private chatService:ChatService,
    private demoAdapter:DemoAdapter,
    private afs:AngularFirestore,
    
  ) {
    this.items = Array.from({ length: 1 });
    
  }

  ngOnInit() {

    let token = localStorage.getItem("access_token");
     if(token){
       this.ss.getAuthorization(token).subscribe(
         (success)=>{          
            this.ss.changeAdminUserJSON(success);  
            this.authenticated = true;  

            success.userDtls[0].screenInfo.forEach((el)=>{
              if(el.screenCode =="103" && el.accessLevel=="999"){
                this.chatService.authenticateUserOnFb( success.userid, success.userDtls[0].userName );            
                
                this.chatService.fbUserId$.subscribe((fbUserId)=>{
                  if(fbUserId){
                    this.fbLoggedInUserId = fbUserId;
                     this.adapter          = this.demoAdapter;    
                    
                       
                     // this.demoAdapter.users$.subscribe((fbUsers)=>{
                    //   this.closeChatWindows(fbUsers)              
                    // })

                  }
                })
              }
            });

            setTimeout(()=>{
              this.gaDetails();
              this.galistDetails();
            }, 5);

         },        
         (error)=>{
           this.authenticated = false;
           this.ss.changeAdminUserJSON(null);        
         }
       );
     }

     this.ss.changeCurrentPage(this.location.path())
     
     //to decrypt value form the URL
     this.activatedRoute.params.subscribe((params: Params) => {
       
       let decryptedValueGaCode = this.activatedRoute.snapshot.queryParams['data'];
       this.agentCode = atob(decryptedValueGaCode);
       let decryptedValueGaName = this.activatedRoute.snapshot.queryParams['finalganame'];
       this.agentName = atob(decryptedValueGaName);
      });
      
      
      this.ss.adminUserJSON$.subscribe(
        (newUserJsonVal)=>{
          this.userJSON = newUserJsonVal;
          
          if(newUserJsonVal && !this.ss.isEmpty(newUserJsonVal) && this.userJSON.userDtls){
            
            this.userJSON.userDtls[0].screenInfo.forEach((el, idx) => {
              if(el.accessLevel=="999")        
                this.accessArr.push( this.ss.screenCodeAccessMapping[el.screenCode] );
            });
            
            if(this.accessArr.indexOf('user_profile')==-1){
              this.router.navigate(['/gati', 'dashboard']);
            }   
            
          } //if
        },
        
        (error)=>{
          this.userJSON = null;
        }
      )
      
    } //onInit


    closeChatWindows(fbUsers){
      if( this.accessArr.indexOf('chat')==-1) return;

      let gaCode;
      if (!this.isSearchedDetails) {
        gaCode = this.agentCode;
      }
      else {
        gaCode = this.searchedGaCode
      }
      
      fbUsers.forEach((user)=>{
        if(user.id !=gaCode)
        this.chatInstance.triggerCloseChatWindow(user.id)
      })
    }

    openChat(e){
      if( this.accessArr.indexOf('chat')==-1) return;
      
      let gaCode;
      if (!this.isSearchedDetails) {
        gaCode = this.agentCode;
      }
      else {
        gaCode = this.searchedGaCode
      }


      //gaCode = "E7051NS" //CMT - just for test.
      
      
      let userDocRef = this.afs.collection("users").doc(gaCode).get().pipe(map((doc)=>{
        if(doc.exists) {                               
            let data:any  = doc.data();
            
            let user = {
              id: gaCode, 
              displayName:data.name,
              status:UserStatus.Away,
              avatar: data.profilePicturePath ? data.profilePicturePath : ""
            }
  
            this.chatInstance.triggerOpenChatWindow(user);        
        }            
        else{
            alert("GA not activated.");
        } 
        
      })).subscribe()
    
    }
    
    
    resetPassword(){

      if( (this.accessArr.indexOf('password_reset')==-1) ) return;

      let ans = confirm("Are you sure to Reset Password");
      if(!ans) return;

      this.showCtxMenu = false
      this.ss.changeBlockUI({start:true, message:'...'})
      
      let gaCode  = this.agentCode;

      this.gaListService.resetPassword(gaCode).subscribe(
        (data)=>{
          
          setTimeout(()=>{ this.ss.changeBlockUI({start:false, message:''}) }, 200);
          this.alertService.success("Password Reset Successfully!", true);
        },
        (error)=>{
          if(error.status >499){
            let errMsg = "Internal Server Error";
            this.alertService.error(errMsg);
          }
          else{
            error = error.json()
            this.alertService.error(error.message);
          }
          setTimeout(()=>{ this.ss.changeBlockUI({start:false, message:''}) }, 200);
        }
      );
    }


    enableDisableUser(){
      
      if( (this.accessArr.indexOf('user_profile')==-1) ) return;

      let gaCode  = this.agentCode;
      let action  = this.isEnabled ? "Disable": "Enable"

      let ans     = confirm("Are you sure to " +  action + " GA: " + this.agentCode);
      if(!ans) return;

      this.showCtxMenu = false
      this.ss.changeBlockUI({start:true, message:'...'})

      this.gaListService.enableDisableUser(this.agentCode,(this.isEnabled ? 0: 2)).subscribe(
        (data)=>{
          setTimeout(()=>{ this.ss.changeBlockUI({start:false, message:''}) }, 200);

          this.isEnabled = !this.isEnabled
          let status =  this.isEnabled ? "Enabled": "Disabled"          
          this.alertService.success("GA " + status,  true);
        },
        (error)=>{
          setTimeout(()=>{ this.ss.changeBlockUI({start:false, message:''}) }, 200);

          if(error.status >499){
            let errMsg = "Internal Server Error";
            this.alertService.error(errMsg);
          }
          else{
            error = error.json().message;
            this.alertService.error(error);
          }          
        }
      );
    }
    
    
  gaDetails() {
    let gaCode;
    if (!this.isSearchedDetails) {
      gaCode = this.agentCode;
    }
    else {
      gaCode = this.searchedGaCode
    }

    this.ss.changeBlockUI({start:true, message:'loading...'})

    let locationCode = this.userJSON.userDtls[0].locationCode

    this.gaListService.gaDeliveryStatusDetails(gaCode, locationCode).subscribe(
      data => {      
        this.totalDockets     = data.totalDockets;
        this.Delivered        = data.delivered;
        this.Undelivered      = data.unDelivered;
        this.Attempted        = data.attempted;
        this.NotAttempted     = data.notAttempted;
        this.POD              = data.pendingPod;
        this.CODpercentage    = ((data.deliveryAmount / data.totalCod) * 100);//to handle zero at denomenator.
        this.Titleheading.push("out of " + data.totalCod);
        this.totalCOD         = data.deliveryAmount;
        this.DocketPercentage = ((data.delivered / data.totalDockets) * 100);
        this.mb               = data.mobileNumber;
        this.iEMI             = data.imeiNumber;
        this.mobileOS         = data.mobileOs;
        this.appVersion       = data.appVersion;
        this.mobileModel      = data.mobileModel;
        this.ouCode           = data.ouCode;
        this.isEnabled        = data.isEnabled

        setTimeout(()=>{
          this.ss.changeBlockUI({start:false, message:'loading....'})
        }, 250);
        
      },
      (error)=>{
        
        if(error.status>499){
          this.alertService.error("Internal Server Error");
        }
        
        else{
          error = error.json();
          this.alertService.error(error.message);
          
          if(error.status==401){
           this.router.navigate(['/gati', 'dashboard'])
         }

        } //els

      });

  } //fn

  getDetails(gaCode, gaName) {
    this.agentName = ''
    this.agentCode = '';
    this.isSearchedDetails = true
    this.searchedGaCode = gaCode;
    this.searchedGaName = gaName;
    this.agentName = gaName;
    this.agentCode = gaCode;
    this.gaDetails();
  }

  galistDetails() {
    this.isloading = true;
    //this.ss.changeBlockUI({start:true, message:'...'})
    var searchParam = this.getSearchItem() ? this.getSearchItem() : '';

    if (!this.isScroll) {
      var lim = 10;
    }
    else {
      var lim = this.finallimit;
    }

    let locationCode = this.userJSON.userDtls[0].locationCode

    this.gaListService.gaList(searchParam, lim, locationCode).subscribe(
      data => {
        this.listdata = data.userList;
        this.isloading = false;
        setTimeout(()=>{
          this.ss.changeBlockUI({start:false, message:''})
        }, 250);
      })
  }

  searchList(SearchText): any {
    if (SearchText == '' || SearchText == undefined) {
      this.searchedParam = '';
      this.galistDetails();
    }
    else {
      this.searchedParam = SearchText;
      this.galistDetails();
    }
  }

  getSearchItem(): any {
    return this.searchedParam;
  }

  onScroll() {
    this.isScroll = true;
    this.finallimit += this.limit;
    this.galistDetails();
  }


  showHideActionsMenu(){
    this.showCtxMenu = !this.showCtxMenu;
  }

}
