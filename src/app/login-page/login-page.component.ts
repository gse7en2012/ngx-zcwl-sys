import { Component, OnInit, HostListener } from '@angular/core';
import { Router, CanActivate,ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../service/user.service';
// import { setInterval } from 'timers';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: [UserService]
})
export class LoginPageComponent implements OnInit {
  //18129969569
  public username: string = '';
  public pass: string = '';
  public navMinHeight: string;
  public isSendSms: boolean = false;
  public timer: number = 60;
  private stId: any;

  public phoneList:any=[];

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router ) { }

  ngOnInit() {
    this.navMinHeight = (window.innerHeight) + 'px';
    this.phoneList=this.userService.getPhoneCookie()||[];


    this.route.queryParams.subscribe(params => {
      if(params.forbbiden==1){
        alert('鉴权失败，请重新登录！')
      }
    });

  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if (event.keyCode === 13) { this.adminLogin(); }
  }

  adminLogin() {
    if (!this.username) return alert('请输入手机号码');
    if (!this.pass) return alert('请输入验证码');

   

    this.userService.adminLogin(this.username, this.pass).then(data => {
      this.userService.savePhoneToCookie(this.username);
      this.router.navigate(['/admin/master']);
    }).catch(e => {
      alert(e);
    });
  }



  setUpCounter() {
    this.stId = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.stId);
        this.isSendSms = false;
        this.timer = 60;
      }
    }, 1000)
  }

  getSmsCode() {
    if (!this.username) return alert('请输入手机号码')
    this.userService.getSmsCode(this.username).then(data => {
      this.pass = data.check_code;
      this.isSendSms = true;
      alert('验证码已发送到手机号码' + this.username + '，请查收！');
      this.setUpCounter();
    }).catch(e => {
      alert(e);
    });
  }

}
