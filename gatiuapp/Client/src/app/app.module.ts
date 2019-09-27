import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DemoAdapter } from './Home/dashboard/DemoAdapter';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './Home/dashboard/dashboard.component';
import { GAlistDetailsComponent } from './GA-list/galist-details/galist-details.component';
import { HeaderComponent } from './Header/header/header.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AgmCoreModule } from '@agm/core';
import { NgChatModule } from './ng-chat/ng-chat.module';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import {MatCheckboxModule} from '@angular/material'
import { MatSnackBarModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';

import { MessageComponent } from './Msg-Broadcast/message/message.component'

import { MessageService } from './Services/message.service';
import {gaListService} from './Services/index';
import { SharedService } from './Services/shared.service';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { SessionComponent } from './session/session.component';
import { RbacAuthComponent } from './rbac-auth/rbac-auth.component';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './alert.service';
import { environment } from '../environments/environment';

import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule, FirestoreSettingsToken} from 'angularfire2/firestore';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import { ChatService } from './Services/chat.service';

export const firebaseConfig = environment.firebaseConfig

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    GAlistDetailsComponent,
    MessageComponent,
    NotFoundComponent,
    SessionComponent,
    RbacAuthComponent,
    AlertComponent,
  ],
  imports: [
    NgIdleKeepaliveModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule ,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    ScrollDispatchModule,
    MatListModule,
    MatCardModule,
    MatChipsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatSnackBarModule,

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAleOuXtyAso3nDnlDxVThz-v-IC7-JY4U'
    }),

    BlockUIModule.forRoot(),
    NgCircleProgressModule.forRoot({
      "radius": 60,
      "space": -10,
      "outerStrokeWidth": 10,
      "innerStrokeWidth": 10,
      "animateTitle": false,
      "animationDuration": 1000,
      "showUnits": false,
      "showBackground": false,
      "clockwise": false,
      "startFromZero": false
    }),

    NgChatModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule
  ],
  providers: [
      gaListService, MessageService, SharedService, AuthGuard, AlertService,
      ChatService, DemoAdapter,
      { provide: FirestoreSettingsToken, useValue: {} }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
