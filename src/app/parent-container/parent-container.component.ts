import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../service/user.service';


@Component({
  selector: 'app-parent-container',
  templateUrl: './parent-container.component.html',
  styleUrls: ['./parent-container.component.scss']
})
export class ParentContainerComponent implements OnInit {

  public userInfo:any;

  constructor(private userService: UserService, private router: Router, ) { }

  ngOnInit() {
    this.userInfo=this.userService.getAdminInfo();
    console.log(this.userInfo);
    
  }


  logout(){
    this.userService.logOut();
    this.router.navigate(['/login']);
  }
}
