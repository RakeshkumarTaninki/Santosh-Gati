import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { ChatAdapter }  from './../../ng-chat/core/chat-adapter';
import { User }         from './../../ng-chat/core/user';
import {  Message }     from './../../ng-chat/core/message';
import {  UserStatus }  from './../../ng-chat/core/user-status.enum';

import { Observable, BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import { map } from 'rxjs/operators'
import { delay } from "rxjs/operators";
import { switchMap } from 'rxjs/operators';

@Injectable()
export class DemoAdapter extends ChatAdapter
{

    public usersSubject = new BehaviorSubject<any>([]);
    users$:Observable<any> =  this.usersSubject.asObservable()
    users:Array<any>    = [];
    avatar:string       = "https://68.media.tumblr.com/avatar_d28d7149f567_128.png"
    loggedInUserId:string = ""

    constructor(private afs:AngularFirestore) {
        super();    
    }
    
    listFriends(): Observable<any[]> {        
        this.fetchUsersFromFirebase()    
        return this.users$;
    }


    fetchUsersFromFirebase(){
        this.loggedInUserId = localStorage.getItem("fbUserId");
        this.afs.collection("users/" + this.loggedInUserId + "/engagedChatChannels").snapshotChanges().pipe(
            map((engUserDocs)=>{
                 let users      = [];
                 let length     = engUserDocs.length;
                 let counter    = 0;

                 return engUserDocs.map((engDoc)=>{
                    let id = engDoc.payload.doc.id;
                    
                    this.afs.collection("users").snapshotChanges().pipe(
                        map((userDocs)=>{
                             return userDocs.map((userDoc)=>{
                                 let data:any = userDoc.payload.doc.data()
                                 let userId   = userDoc.payload.doc.id  

                                 let userObj ={
                                     id: id,
                                     displayName: data.name,
                                     avatar: data.profilePicturePath ? data.profilePicturePath : "",
                                     status: UserStatus.Online
                                 }

                                 if(id==userId && ! users.find((el)=>el.id == id) ){                                    
                                    users.push(userObj)
                                 } 

                                 return userObj
                             })
                            
                         })
                     ).subscribe(()=>{
                         counter++;
                         if(counter==length){
                            //willBeExec @last & once
                            this.usersSubject.next(users)                                                                               
                        }                         
                     })

                 }) //returned statement
                 
             })
             
        ).subscribe((d)=>{
            //willBeExec @first & once
        });

    }
    
    
    getMessageHistory(userId: any): Observable<any[]> {                    
        let docRef          = this.afs.collection("users/" + this.loggedInUserId + "/engagedChatChannels/").doc(userId)

        return docRef.get().pipe(map((doc)=>{
            if(doc.exists) {                               
                let data:any  = doc.data()
                return data.channelId
            }            
            else{
                return false;
            } 
            
        })).pipe(
            switchMap((channelId)=>{
                let afsCol =  this.afs.collection("chatChannels/"+channelId+"/messages/", (ref)=> ref.orderBy('time')).snapshotChanges().pipe(
                    map((messages)=>{
                        return messages.map(a=>{        
                            const data:any  = a.payload.doc.data();
                            
                            let formattedMsg = {
                                fromId:  data.senderId,
                                toId:    data.recipientId,
                                message: data.text,
                                time:    data.time,
                            }
        
                            return formattedMsg                                            
                        })
                        
                    }) //map

                ) //pipe
                        
                return afsCol
            })//sm

        ) //pipe
    }

    sendMessage(message: Message){ 
        let channel$ = this.getChatChannelID(message.fromId, message.toId)
        
        let msg = {
            senderId      : message.fromId,
            recipientId   : message.toId,
            senderName    : localStorage.getItem("fbUserName"),
            text          : message.message,
            time          : firebase.firestore.FieldValue.serverTimestamp(),
            type          : "TEXT"
        }

        
        
        channel$.subscribe((ch)=>{  
            if(ch instanceof Promise){ //channelNotExists
                ch.then((chnId)=>{                               
                    this.afs.collection("chatChannels/"+ chnId + "/messages").add(msg)                    
                })                
            }
            else this.afs.collection("chatChannels/"+ ch + "/messages").add(msg) //channeExists             
        })
    }
    
    
    getChatChannelID(senderId, recipientId){
        let srcPath = "users/" +senderId+    "/engagedChatChannels/" ;
        let tgtPath = "users/" +recipientId+ "/engagedChatChannels/" ;    
        let docRef  = this.afs.collection(srcPath).doc(recipientId)        

        let dummyMessage ={
            fromId:     senderId  ,
            toId:       recipientId,
            message:    ""
        }
        
        let dummyUser = {
            id: recipientId,
            displayName: "",
            avatar: "",
            status: UserStatus.Online
        }

        return docRef.get().pipe(map((doc)=>{
            if(doc.exists) return doc.data().channelId                                       
            
            else{ //createChannel        
                return this.afs.collection("chatChannels").add({userIds:[senderId, recipientId]})
                
                .then((newChannel)=>{       
                    this.afs.collection(srcPath).doc(recipientId).set({channelId:newChannel.id})  
                    this.afs.collection(tgtPath).doc(senderId).set({channelId:   newChannel.id})                      
                    this.onMessageReceived(dummyUser, dummyMessage)
                    return newChannel.id
                }) 
            }

        }))
    
    } //fn 
    
}