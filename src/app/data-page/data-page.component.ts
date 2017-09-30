import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss']
})
export class DataPageComponent implements OnInit {

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
