import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from '../../Services/message.service';
import { SharedService } from '../../Services/shared.service';
import {MatCheckboxModule} from '@angular/material'
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { send } from 'q';
import { environment } from '../../../environments/environment'; //req when needed to test which env config is taken when running ng-serve/ng-build with --configuration=beta/prod

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  env = environment
  defaultThumb:string = "/assets/Images/previewImg.svg"
  check=true;
  loading = false;
  messageBroadcastForm:FormGroup;

  zones:any       = [] ;
  edcs:any        = [] ;
  gdws:any        = [] ;
  ouCodes:any     = [] ;

  zone    :any    = [] ;
  edcCode :any    = [] ;
  states  :any    = [] ;
  ouCode  :any    = [] ;
  filter:string   = "";

  totalRecipient:number = 0;
  thumbnailUrl:string = this.defaultThumb;

  userJSON:any;
  screenCodes = [];
  accessArr   = [];
  authenticated:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private ss:SharedService,
    private router: Router,
    private location: Location
  ) { 

    this.messageBroadcastForm = this.formBuilder.group({

      sendAll:    [false, []],
      zone:       new FormControl(),
      edc:        new FormControl(),
      gdw:        new FormControl(),
      ouCode:     new FormControl(),

      message:    ['', [Validators.required]],
      title:      ['', [Validators.required]],
      thumbnail:  ['', []]
    });

  }


  ngOnInit() {   
    this.ss.changeCurrentPage(this.location.path())
    this.ss.changeBlockUI({start:false, message:''});

    let token = localStorage.getItem("access_token");
    if(token){
      this.ss.getAuthorization(token).subscribe(
        (success)=>{          
          this.authenticated = true;  
          this.ss.changeAdminUserJSON(success);  
        },        
        (error)=>{
          this.authenticated = false;
          this.ss.changeAdminUserJSON(null);        
        }
      );
    }


    this.ss.adminUserJSON$.subscribe(
      (newUserJsonVal)=>{
        this.userJSON = newUserJsonVal;

        if(newUserJsonVal && !this.ss.isEmpty(newUserJsonVal) && this.userJSON.userDtls){
          this.userJSON.userDtls[0].screenInfo.forEach((el, idx) => {    
            if(el.accessLevel=="999")          
              this.accessArr.push( this.ss.screenCodeAccessMapping[el.screenCode] );
          });

          if(this.accessArr.indexOf('broadcast')==-1){
            this.router.navigate(['/gati', 'dashboard']);
          }
        }
      },

      (error)=>{
        this.userJSON = null;
      }
    )

    this.onFilterChange({value:[]}, "all", true)

  } //fn


  checkFormValidation(){
    return ( this.messageBroadcastForm.controls['zone'].value.length 
            || this.messageBroadcastForm.controls['edc'].value.length
            || this.messageBroadcastForm.controls['gdw'].value.length
            || this.messageBroadcastForm.controls['ouCode'].value.length
            || this.messageBroadcastForm.controls['sendAll'].value 
          )
  }


  sendAllHandler(event){
    if(event.checked){  //on sendAll = true  

      this.messageBroadcastForm.controls['zone'].disable();
      this.messageBroadcastForm.controls['edc'].disable();
      this.messageBroadcastForm.controls['gdw'].disable();
      this.messageBroadcastForm.controls['ouCode'].disable();
      this.messageBroadcastForm.controls['zone'].setValue('');
      this.messageBroadcastForm.controls['edc'].setValue('');
      this.messageBroadcastForm.controls['gdw'].setValue('');
      this.messageBroadcastForm.controls['ouCode'].setValue('');

      this.filter   = "all";
      this.zone     = [];
      this.edcCode  = [];
      this.states   = [];
      this.ouCode   = [];

      this.onFilterChange(event, "all")
    }
     else{     //on sendAll = false
      this.totalRecipient = 0;
      this.messageBroadcastForm.controls['zone'].enable();
      this.messageBroadcastForm.controls['edc'].enable();
      this.messageBroadcastForm.controls['gdw'].enable();
      this.messageBroadcastForm.controls['ouCode'].enable();      
    }
  }

  clearDropdowns(idx){
    switch(idx){
      case 0:
        this.edcs     = [];
        this.gdws     = [];
        this.ouCodes  = [];
        this.messageBroadcastForm.controls['edc'].setValue('');
        this.messageBroadcastForm.controls['gdw'].setValue('');
        this.messageBroadcastForm.controls['ouCode'].setValue('');

      case 1:
        this.gdws     = [];
        this.ouCodes  = [];
        this.messageBroadcastForm.controls['gdw'].setValue('');
        this.messageBroadcastForm.controls['ouCode'].setValue('');
      
      case 2:
        this.ouCodes  = [];
        this.messageBroadcastForm.controls['ouCode'].setValue('');
    }
  }

  onFilterChange(event, entity, resetRecp=false){    
    let entities =['zone', 'edc', 'gdw', 'ouCode' ]

    this.loading = true;
    this.ss.changeBlockUI({start:true, message:'...'});
    let data    :any    = [] ;
    let val

    if(event.value){
      val          = event.value;
      this.zone    = this.messageBroadcastForm.controls['zone'].value    ? this.messageBroadcastForm.controls['zone'].value :    []
      this.edcCode = this.messageBroadcastForm.controls['edc'].value     ? this.messageBroadcastForm.controls['edc'].value :     []
      this.states  = this.messageBroadcastForm.controls['gdw'].value     ? this.messageBroadcastForm.controls['gdw'].value :     []
      this.ouCode  = this.messageBroadcastForm.controls['ouCode'].value  ? this.messageBroadcastForm.controls['ouCode'].value :  []      
    }

    if(event.checked) val = event.checked;
    
    if(val.length==0){
      let currEntityIdx = entities.indexOf(entity);
      
      this.clearDropdowns(currEntityIdx)

      if(currEntityIdx > 0)
        entity = entities[currEntityIdx-1] ;      
      
      else{
        entity = "all"
        resetRecp = true;
      } 
    }
  
    switch(entity){
      case 'zone'     :
        this.filter = 'zone'
        break;

      case 'edc'  :
        this.filter = 'zone_edc'
        break;

      case 'gdw'   :
        this.filter = 'zone_edc_states'
        break;

      case 'ouCode'   :
        this.filter = 'zone_edc_states_oucode'
        break;    

      case 'all':
        this.filter ="all";
        break;
    }

    let payloadFilter={
      filter:   this.filter,
      zone:     this.zone,
      edcCode:  this.edcCode,
      states:   this.states,
      ouCode:   this.ouCode
    }
      
    
    this.messageService.fetchPNFilterData(payloadFilter).subscribe(
    (data)=>{           
          this.totalRecipient = data.totalRecipient;
          
          if(resetRecp) this.totalRecipient =0

          switch(entity){
            case 'zone' :
              this.edcs = data.filterList;
              break;
          
            case 'edc' :
              this.gdws = data.filterList;
              break;

            case 'gdw' :
              this.ouCodes = data.filterList;
              break;  
            case 'all' :
              this.zones = data.filterList;
              break;
          }
          this.loading = false;
          setTimeout(()=>{
            this.ss.changeBlockUI({start:false, message:''});
          }, 250);
      },
      (error)=>{
        this.loading = false;
        setTimeout(()=>{
          this.ss.changeBlockUI({start:false, message:''});
        }, 250);
      }
    )
  } //fn


  thumbnailUrlChange(event){
    let newImgUrl = event.target.value
    this.thumbnailUrl =  newImgUrl;
  }

  thumbnailErrorHandler(event){
    event.target.src = this.defaultThumb;
  }


  sendMessage(){
    let ans = confirm('Are you sure to send the notification?');
    if(!ans) return;

    this.loading = true;    
    let formData = this.messageBroadcastForm.getRawValue()
    this.ss.changeBlockUI({start:true, message:'...'});

    let messageData = {
      title:formData.title,
      message:formData.message,
      icon: formData.thumbnail,
      filter_data: {
        "broadcast": true,
        "filter":   this.filter,
        "zone":     this.zone,
        "edcCode":  this.edcCode,
        "states":   this.states,
        "ouCode":   this.ouCode
      }
    }
    
        
    this.messageService.broadcastMessage(messageData).subscribe(
      (data)=>{
        this.messageBroadcastForm.reset();
        this.loading= false;
        
        setTimeout(()=>{
          this.ss.changeBlockUI({start:false, message:''});
        }, 250);
      },

      (error)=>{
        if(error.statusCode==250){
          alert('Server Error. Unable to send message. Please contact support team.');
        }else{        
        }

        this.loading = false;

        setTimeout(()=>{
          this.ss.changeBlockUI({start:false, message:''});
        }, 250);
      }
    );
  } //fn

}
