import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ChatAdapter } from './../../ng-chat/core/chat-adapter';
import { IChatController } from '../../ng-chat/core/chat-controller';
import { UserStatus } from '../../ng-chat/core/user-status.enum';
import { DemoAdapter } from './DemoAdapter';
import { ChatService } from '../../Services/chat.service';
import { AngularFirestore } from 'angularfire2/firestore';
import {map} from 'rxjs/operators'

import { Router } from '@angular/router';
import { gaListService } from '../../Services/index';
import { SharedService } from '../../Services/shared.service';
import { Location } from '@angular/common'
import { Subscription } from 'rxjs';
import { log } from 'util';
import { AlertService } from '../../alert.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('chatInstance') protected chatInstance: IChatController;
  today=new Date();
  lat: number = 51.678418;
  lng: number = 7.809007;
  Title: string = 'Dockets';
  subtitle: number = 0;
  title: string = 'app';
  userId = 999;
  items: any = [];
  SearchText: any;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  Delivered: number = 0;
  Undelivered: number = 0;
  Attempted: number = 0;
  NotAttempted: number = 0;
  statusbar: any;
  listResult: any;
  isScroll: boolean = false;
  finallimit: number = 10;
  limit: number = 10;
  searchedParam: string = '';
  isloading: boolean = false;
  count:number
  messageCount:number = 0;
  totalTries:number = 2;

  public adapter: ChatAdapter;
  userJSON:any;
  accessArr:any = [];
  subscription:Subscription[] =  []
  authenticated:boolean = false;
  locationCode:string;
  fbLoggedInUserId:string;

  constructor(
    private gaListService: gaListService, 
    private router: Router,
    private ss:SharedService,
    private location:Location,
    private ref:ChangeDetectorRef,
    private alertService:AlertService,
    private chatService:ChatService,
    private afs:AngularFirestore,
    private demoAdapter:DemoAdapter
  ) {
    this.items.length = 100;
  }
  
  
  ngOnInit() {        
    this.ss.changeCurrentPage(this.location.path())
    let token = localStorage.getItem("access_token");

    if(token){
      this.ss.getAuthorization(token).subscribe(
        (success)=>{          
          this.authenticated = true;  
          
          success.userDtls[0].screenInfo.forEach((el)=>{
            if(el.screenCode =="103" && el.accessLevel=="999"){
              this.chatService.authenticateUserOnFb( success.userid, success.userDtls[0].userName );            
              
              this.chatService.fbUserId$.subscribe((fbUserId)=>{
                if(fbUserId){
                  this.fbLoggedInUserId = fbUserId;
                  this.adapter          = this.demoAdapter;                  
                }
              })
            }
          })
          
          this.ss.changeAdminUserJSON(success);  
          this.locationCode = success.userDtls[0].locationCode
          
          setTimeout(()=>{
            this.gaDetailList();
            this.todayDocketStatus();                          
          }, 5);

        },        
        (error)=>{
           this.authenticated = false;
           this.ss.changeAdminUserJSON(null);        
        }
      );
    }

    let sub1  =  this.ss.adminUserJSON$.subscribe(
      (newUserJsonVal)=>{
        this.userJSON = newUserJsonVal;

        if(newUserJsonVal && !this.ss.isEmpty(newUserJsonVal) && this.userJSON.userDtls){
          this.userJSON.userDtls[0].screenInfo.forEach((el, idx) => {     
            if(el.accessLevel=="999" && this.accessArr.indexOf(this.ss.screenCodeAccessMapping[el.screenCode])==-1)         
              this.accessArr.push( this.ss.screenCodeAccessMapping[el.screenCode] );
          });
        }
      },

      (error)=>{
        this.userJSON = null;
      }
    )

    this.subscription.push(sub1);
  } //onInit
  
  
  closeForm() {
    document.getElementById("myForm").style.display = "none";
  }
  
  //chatStarts
  openChat(e, gaCode){
    //gaCode = "E7051NS" //CMT - just for test.
    
    if( this.accessArr.indexOf('chat')==-1) return;
    
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

  messageSeen(event) {
    
  }

  chatClosed(e){
    
  }

  chatOpened(e){
    
  }

  participantClicked(e){
    
  }
  //chatEnds


  todayDocketStatus() {
    let locationCode = this.userJSON.userDtls[0].locationCode
  
    let sub2 =this.gaListService.docketStatusGet(locationCode).subscribe(
      data => {
        this.subtitle = data.totalDockets;
        this.Attempted = data.attempted;
        this.NotAttempted = data.notAttempted;
        this.Delivered = data.delivered;
        this.Undelivered = data.unDelivered;
        this.statusbar = ((data.delivered / data.totalDockets) * 100);
      })

      this.subscription.push(sub2);
  }
  

  gaDetailList() {
    this.isloading = true;
    var searchParam = this.getSearchItem() ? this.getSearchItem() : '';
    if (!this.isScroll) {
      var lim = 10;
    }
    else {
      var lim = this.finallimit;
    }

    let locationCode = this.userJSON.userDtls[0].locationCode

    let sub3 = this.gaListService.allgaDetailList(searchParam, lim, locationCode).subscribe(
      data => {
          this.isloading = false;          
          this.listResult = data.userList;  
          
          // this.listResult = this.listResult.map((el, idx)=>{
          //   if(idx==0){
          //     el.gaCode = "G1937KN"
          //   }
          //   return el
          // })
          
          this.count=data.userList.length;
      },
      (error)=>{
        console.log("called error block")
        setTimeout(()=>{ this.ss.changeBlockUI({start:false, message:''}) }, 200);
          error = error.json().message;
          if(typeof error == 'undefined'){
            if(this.totalTries != 0){
              this.totalTries--;
              this.gaDetailList();
            }

            if(this.totalTries == 0){
              this.alertService.error('Something went wrong! Please try again')
            }
          }
          
          else{
            this.alertService.error(error);
          }
          // for(var i = 1; i <= this.totalTries;i++){
          //   this.totalTries--;
          //   this.gaDetailList();
          // }

          console.log('Eror', error);        
      }
    )

    this.subscription.push(sub3);
  }


  searchList(SearchText): any {
    if (SearchText == '' || SearchText == undefined) {
      this.searchedParam = '';
      this.gaDetailList();
    }
    else {
      this.searchedParam = SearchText;
      this.gaDetailList();
    }
  }

  getSearchItem(): any {
    return this.searchedParam;
  }


  onScroll(e) {
    this.isScroll = true;
    this.finallimit += this.limit;
    this.gaDetailList();
  }


  getAgentCode(code, ganame) {

    if( this.accessArr.indexOf('user_profile')==-1){
      return;
    } 

    let finalcode = btoa(code);
    let finalganame = btoa(ganame);

    this.router.navigate(['/gati/galist'], { queryParams: { data: finalcode, finalganame } });
  }



  showGeoFence(e, gaCode){
    if( this.accessArr.indexOf('geo_fence')==-1) return;
  }

  enableDisableUser(e, gaCode, isEnabled){
    if( (this.accessArr.indexOf('user_profile')==-1) ) return;

    let action = isEnabled ? "Disable": "Enable"
    let ans = confirm("Are you sure to " +  action + " GA: " + gaCode);

    if(!ans) return;
    this.ss.changeBlockUI({start:true, message:'...'})

    this.gaListService.enableDisableUser(gaCode, (isEnabled ? 0: 2) ).subscribe(
      (data)=>{

        this.listResult =  this.listResult.map((el, idx)=>{
          if(el.gaCode==gaCode){            
            el.isEnabled = !el.isEnabled;
            return el;
          }
            
          else return el;
        });

        setTimeout(()=>{ this.ss.changeBlockUI({start:false, message:''}) }, 200);

        let status =  isEnabled ? "Disabled": "Enabled"  
        this.alertService.success("GA: " + gaCode +" is " + status);        
      },
      (error)=>{
        setTimeout(()=>{ this.ss.changeBlockUI({start:false, message:''}) }, 200);

          error = error.json().message;
        if(typeof error == 'undefined'){
          this.alertService.error('Something went wrong! Please try again')
        }else{
          this.alertService.error(error);
        }
      }
    );
  }


  ngOnDestroy(){
    this.subscription.forEach(s => s.unsubscribe());
  }
}