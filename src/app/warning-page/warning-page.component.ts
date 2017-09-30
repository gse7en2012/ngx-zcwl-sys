import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-warning-page',
  templateUrl: './warning-page.component.html',
  styleUrls: ['./warning-page.component.scss']
})
export class WarningPageComponent implements OnInit {


  public branchList=[]

  constructor() { }

  ngOnInit() {
    for(let i=0;i<8;i++){
      this.branchList.push({
        name:'天地会总舵',
        pic:'../assets/image/device.png',
        num:3,
        percent:'4/5',
        id:i
      })
    }
  }

}
