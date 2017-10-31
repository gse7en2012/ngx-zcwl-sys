import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Router, CanActivate } from '@angular/router';

@Component({
  selector: 'app-super-container',
  templateUrl: './super-container.component.html',
  styleUrls: ['./super-container.component.scss']
})
export class SuperContainerComponent implements OnInit {

  public userInfo: any;

  constructor(private userService: UserService, private router: Router, ) { }

  ngOnInit() {
    this.userInfo = this.userService.getAdminInfo();
  }


  logout() {
    this.userService.logOut();
    this.router.navigate(['/login']);
  }

}
