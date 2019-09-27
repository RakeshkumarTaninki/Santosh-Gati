import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Http, Response } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';


@Injectable()
export class ChatService {
  apiUrl = environment.apiUrl;

  constructor(private afAuth:AngularFireAuth, 
    private http:Http,
    private afs:AngularFirestore
  ) { }

  login(token){    
      return this.afAuth.auth.signInWithCustomToken(token).then((resolve)=>{
        return resolve.user;
      })
    
  }

  addUserOnFb(user, userName){    
    //adds iff userDoesNotExist on firestoreDB.    
    let userObj = {
      bio:  "",
      name: userName,
      profilePicturePath:"",
      registrationTokens:[]
    }

    let userDocRef = this.afs.collection("users").doc(user.uid)

    userDocRef.get().pipe(map((doc)=>{          
      if(!doc.exists) this.afs.collection("users").doc(user.uid).set(userObj)      
    })).subscribe((success)=>{}) 
  }


  authenticateUserOnFb(userId, userName){  
        
    this.getFbAuth(userId).subscribe((token)=>{
       
      setTimeout(()=>{
        this.login(token.token).then((fbUser:any)=>{
          this.changeFbUserId(fbUser.uid) 

          localStorage.setItem("fbUserId",    fbUser.uid);
          localStorage.setItem("fbUserName",  userName);
          
          this.addUserOnFb(fbUser, userName)
        })
      }, 300) 

    },

    error=>{
      console.log("error", error);
    })
  }
  


  getFbAuth(gaCode){
    let token = localStorage.getItem("access_token");
    let headers = new Headers({ "Content-Type": "application/json"});
    headers.append("authorization", "Basic "+token)
    
    let options = new RequestOptions({ headers: headers });
    let url     = "firebase/web/token?agentCode="+gaCode;
    
    return this.http.get(this.apiUrl +url, options).pipe(
      map((response: Response) => {        
        return response.json()
      }) 
    ); 
    
  }


  fbUserId = new BehaviorSubject<any>(false)
  fbUserId$ = this.fbUserId.asObservable()
  changeFbUserId(userId){
    this.fbUserId.next(userId);
  }
  
}
