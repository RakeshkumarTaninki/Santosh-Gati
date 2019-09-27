import { Injectable } from '@angular/core';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class RunsheetServiceService {

  constructor() { }

  showRunsheet():void
  {
    //alert($("#runsheetModal")
      $("#runsheetModal").modal('show');
  }
}
