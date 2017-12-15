import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../service/user.service';


@Component({
  selector: 'app-parent-container',
  templateUrl: './parent-container.component.html',
  styleUrls: ['./parent-container.component.scss']
})
export class ParentContainerComponent implements OnInit {

  public userInfo: any={};

  constructor(private userService: UserService, private router: Router, ) { }

  ngOnInit() {
    this.userInfo = this.userService.getAdminInfo();
    this.userService.getUserCenter().then((data) => {
      this.userInfo=Object.assign(this.userInfo,data);
    })

  }
  waiting() {
    alert('敬请期待')
  }

  logout() {
    this.userService.logOut();
    this.router.navigate(['/login']);
  }
}
