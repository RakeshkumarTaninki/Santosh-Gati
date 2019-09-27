import { Component, OnInit } from '@angular/core';
import { SharedService } from '../Services/shared.service';

@Component({
  selector: 'not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit{
  constructor(
    private ss:SharedService
  ) { }

  ngOnInit(){
    setTimeout(()=>{
      this.ss.changeBlockUI({start:false, message:''});

    }, 300);
  }

}
