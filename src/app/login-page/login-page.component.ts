import { Component, OnInit, HostListener } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: [UserService]
})
export class LoginPageComponent implements OnInit {

  public username: string='13751066522';
  public pass: string='1234';
  public navMinHeight:string;

  constructor(private userService: UserService, private router: Router, ) { }

  ngOnInit() {
     this.navMinHeight = (window.innerHeight) + 'px';
  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if (event.keyCode === 13) { this.adminLogin(); }
  }

  adminLogin() {
    this.userService.adminLogin(this.username, this.pass).then(data => {
      this.router.navigate(['/admin/master']);
    }).catch(e => {
      alert(e);
    });
  }

  getSmsCode(){
    this.userService.getSmsCode(this.username).then(data => {
      this.pass=data.check_code;
    }).catch(e => {
      alert(e);
    });
  }

}
