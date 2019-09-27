import { Routes, RouterModule } from '@angular/router';
import { TransactionReportComponent } from './transaction-report.component';

const childRoutes: Routes = [
    {
        path: '',
        component: TransactionReportComponent
    }
];

export const routing = RouterModule.forChild(childRoutes);
