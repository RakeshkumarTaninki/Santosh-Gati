import { Routes, RouterModule } from '@angular/router';
import { UploadRunsheetComponent } from './upload-runsheet.component';


const childRoutes: Routes = [
    {
        path: '',
        component: UploadRunsheetComponent
    }
];

export const routing = RouterModule.forChild(childRoutes);
