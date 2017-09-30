import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {

  public deviceList=[]
  constructor() { }

  ngOnInit() {
    for(let i=0;i<14;i++){
      this.deviceList.push({
        name:'设备编号'+i,
        online:Math.random()*100+1>50?true:false,
        id:i
      })
    }
  }

}
