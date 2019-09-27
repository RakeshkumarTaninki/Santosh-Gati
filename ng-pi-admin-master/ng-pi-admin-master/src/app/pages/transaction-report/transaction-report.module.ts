import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './transaction-report.routing';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';









@NgModule({
  declarations: [
     
  ],
  imports: [
    CommonModule,
    SharedModule,
    routing,
    NgbModule,
    HttpClientModule
  ]
})
export class TransactionReportModule { }
