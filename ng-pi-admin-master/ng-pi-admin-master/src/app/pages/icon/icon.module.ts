import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './icon.routing';
import { SharedModule } from '../../shared/shared.module';
import { IconComponent } from './icon.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCompressService, ResizeOptions,ImageCompressModule } from 'ng2-image-compress';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        routing,
        ImageCropperModule,
        ImageCompressModule,
        HttpClientModule,
        NgbModule
     
    ],
    declarations: [
        IconComponent
    ],
    providers: [ImageCompressService,ResizeOptions],
})
export class IconModule { }
