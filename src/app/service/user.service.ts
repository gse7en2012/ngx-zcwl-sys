import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie';
import { errCodeMsgHash } from './err-msg';
import { LibService} from './lib.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {

  private serviceUrl: object = {
    login: '/webapi/login',
    getCode: '/webapi/login_checkcode',
    getUserCenter:'/webapi/user_center',
  };

  private codeHash:any;

  public projectListForGlobal:object={};

  constructor(
    private cookieService: CookieService,
    private http: Http,
    private libService:LibService,
    private codeHashObj:errCodeMsgHash
  ) { 
    this.codeHash=codeHashObj.codeHash;
  }


  public adminLogin(username: string, pass: string) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('efairy_phonenumber', username);
    params.set('check_code', pass);
    return this.http.get(this.serviceUrl['login'], { search: params }).map(res => res.json()).toPromise()
      .then((data) => {
        if (data.err_code === 200) {
          this.cookieService.put('pst_token', data.result.access_token);
          this.cookieService.putObject('pst_admin_info', data.result.user_info);
          return data.result;
        } else {
          return Promise.reject(
            this.codeHash[data.err_code] || '系统出错，请联系管理员'
          );
        }
      })
  }

  public getSmsCode(phone: string) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('phonenumber', phone);
    return this.http.get(this.serviceUrl['getCode'], { search: params }).map(res => res.json()).toPromise()
      .then((data) => {
        if (data.err_code === 200) {
          return data.result;
        } else {
          return Promise.reject(
            this.codeHash[data.err_code] || '系统出错，请联系管理员'
          );
        }
      })
  }

  public getUserCenter(){
    const param = this.libService.generateHttpGetSearchParams();
    return this.http.get(`${this.serviceUrl['getUserCenter']}?access_token=${param.token}`, { search: param.search }).map(res => res.json()).toPromise()
    .then((data)=>{
      
    })
  }

  public logOut() {
    this.cookieService.remove('pst_token');
    this.cookieService.remove('pst_admin_info');
  }


  public checkAdminLogin() {
    return !!this.cookieService.get('pst_token');
  }

  public getAdminInfo() {
    console.log(this.codeHash);
    return this.cookieService.getObject('pst_admin_info')

  }

  public setProjectList(list){
    // this.projectListForGlobal=list;
    if (list) {
      this.projectListForGlobal = {};
      list.forEach((item) => {        
        this.projectListForGlobal[item.efairyproject_id] = item;
      })
    }
  }

  public getProjectById(id){
    return this.projectListForGlobal[id]
  }

}
