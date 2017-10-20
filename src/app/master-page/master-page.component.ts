import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../service/user.service';

declare var moment;

@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.scss'],
})
export class MasterPageComponent implements OnInit {

  public userInfo:any;
  public time:string;

  constructor(private userService: UserService, private router: Router, ) { 

  }

  ngOnInit() {
    this.userInfo=this.userService.getAdminInfo();
    this.time=moment().format('YYYY年MM月DD日')
  }

}
