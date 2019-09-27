import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { HttpModule } from '@angular/http'
import { DashboardComponent } from './Home/dashboard/dashboard.component';
import { HeaderComponent } from './Header/header/header.component'
import { GAlistDetailsComponent } from './GA-list/galist-details/galist-details.component';
import { MessageComponent } from './Msg-Broadcast/message/message.component'
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { RbacAuthComponent } from './rbac-auth/rbac-auth.component';
@NgModule({
  imports: [RouterModule.forRoot([
      
      //1
      {path: 'gati',
        canActivate:[AuthGuard],
        canActivateChild:[AuthGuard],
        children: [
        
          { path: 'dashboard', component:   DashboardComponent  },
          { path: 'galist',    component:   GAlistDetailsComponent  },
          { path: 'messageBroadcast',    component:   MessageComponent   },
          
          { path: '', component: HeaderComponent, outlet: 'header' },
        ]
      },

      {path:'404',
        children: [        
          { path: '', component: NotFoundComponent },
        ]
      },

      {path:'authenticating',
        children: [        
          { path: '', component: RbacAuthComponent },
        ]
      },



      //2
      {path: '', pathMatch: 'full', redirectTo: '/authenticating'},


      //3
      {path: '**', redirectTo: '/404'},

    ], { useHash: true})
  ],
  exports: [RouterModule]
})


export class AppRoutingModule { }
